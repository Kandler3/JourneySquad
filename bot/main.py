import os
import logging
import requests
import asyncio
from aiogram import Bot, Dispatcher, types
from aiogram.fsm.state import StatesGroup, State
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram.filters import Command
from aiogram import Router

BOT_TOKEN = os.getenv("BOT_TOKEN")
API_URL = os.getenv("API_URL")
FILE_SERVER_URL = os.getenv("FILE_SERVER_URL")
MINIAPP_URL = os.getenv("MINIAPP_URL")

logging.basicConfig(level=logging.INFO)
bot = Bot(token=BOT_TOKEN)
storage = MemoryStorage()
dp = Dispatcher(storage=storage)
router = Router()

class Registration(StatesGroup):
    waiting_for_age = State()
    waiting_for_gender = State()
    waiting_for_bio = State()

@router.message(Command("start"))
async def start_handler(message: types.Message, state):
    await message.answer("Прежде чем зайти в приложение, пожалуйста, пройдите регистрацию")
    await message.answer("Введите свой возраст:")
    await state.set_state(Registration.waiting_for_age)

@router.message(Registration.waiting_for_age)
async def process_age(message: types.Message, state):
    try:
        age = int(message.text)
        if age < 0:
            raise ValueError()

    except ValueError:
        await message.answer("Возраст должен быть числом. Повтори попытку:")
        return
    await state.update_data(age=age)
    await message.answer("Введите пол (м/ж):")
    await state.set_state(Registration.waiting_for_gender)

@router.message(Registration.waiting_for_gender)
async def process_gender(message: types.Message, state):
    gender_text = message.text.lower()
    if gender_text not in ["м", "ж"]:
        await message.answer("Введите корректное значение: м или ж:")
        return
    await state.update_data(gender=gender_text)
    await message.answer("Расскажите немного о себе:")
    await state.set_state(Registration.waiting_for_bio)

@router.message(Registration.waiting_for_bio)
async def process_bio(message: types.Message, state):
    bio_text = message.text
    data = await state.get_data()
    avatar = await get_avatar_url(message.from_user)
    logging.info(f"Аватарка загружена на {avatar}")
    payload = {
        "telegram_id": message.from_user.id,
        "name": message.from_user.first_name,
        "avatarUrl": avatar,
        "age": data["age"],
        "gender": data["gender"],
        "bio": bio_text
    }
    try:
        resp = requests.post(API_URL + "/api/users", json=payload)
        logging.info(f"miniapp url: {MINIAPP_URL}")
        if resp.status_code in [200, 201]:
            keyboard = types.InlineKeyboardMarkup(inline_keyboard=[
                [types.InlineKeyboardButton(
                    text="Открыть миниапп",
                    web_app=types.WebAppInfo(url=MINIAPP_URL),
                    url=MINIAPP_URL
                )]
            ])
            await message.answer("Регистрация прошла успешно! Перейдите в миниапп", reply_markup=keyboard)
        else:
            await message.answer("Ошибка регистрации. Попробуйте позже.")
    except Exception as e:
        logging.error(e)
        await message.answer("Ошибка соединения с сервером.")
    await state.clear()

async def get_avatar_url(user: types.User):
    try:
        photos = await bot.get_user_profile_photos(user.id)
        if photos.total_count == 0:
            logging.warning(f"Пользователь {user.id} не имеет аватарки.")
            return ""
    except Exception as e:
        logging.error(f"Ошибка получения фотографий пользователя {user.id}: {e}")
        return ""

    try:
        photo = photos.photos[0][-1]  # Берем самое большое фото
        file_info = await bot.get_file(photo.file_id)
        file_bytes = await bot.download_file(file_info.file_path)
        logging.info(f"Фото пользователя {user.id} загружено")
    except Exception as e:
        logging.error(f"Ошибка скачивания аватарки пользователя {user.id}: {e}")
        return ""

    # Функция для загрузки файла на сервер
    def upload_file():
        files = {"file": ("avatar.jpg", file_bytes, "image/jpeg")}
        try:
            resp = requests.post(FILE_SERVER_URL + "/files/upload/avatars", files=files)
            if resp.status_code in [200, 201]:
                url = resp.json().get("path", "")
                if not url:
                    logging.warning(f"Сервер загрузки файлов вернул пустой путь для пользователя {user.id}.")
                return url
            else:
                logging.error(f"Ошибка загрузки аватарки: статус {resp.status_code}, ответ: {resp.text}")
                return ""
        except Exception as e:
            logging.error(f"Исключение при загрузке аватарки: {e}")
            return ""

    avatar_path = await asyncio.to_thread(upload_file)
    logging.info(f"Аватарка пользователя {user.id} отправлена на сервер")

    if not avatar_path:
        logging.warning(f"Не удалось загрузить аватарку пользователя {user.id}, возвращаю пустую строку.")

    return avatar_path


dp.include_router(router)

async def main():
    await dp.start_polling(bot)

if __name__ == '__main__':
    asyncio.run(main())
