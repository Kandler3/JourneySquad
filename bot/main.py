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
    gender = True if gender_text == "м" else False
    await state.update_data(gender=gender)
    await message.answer("Расскажите немного о себе:")
    await state.set_state(Registration.waiting_for_bio)

@router.message(Registration.waiting_for_bio)
async def process_bio(message: types.Message, state):
    bio_text = message.text
    data = await state.get_data()
    payload = {
        "telegram_id": message.from_user.id,
        "age": data["age"],
        "gender": data["gender"],
        "bio": bio_text
    }
    try:
        resp = requests.post(API_URL + "/api/users", json=payload)
        if resp.status_code in [200, 201]:
            await message.answer("Регистрация прошла успешно! Перейдите в миниапп")
        else:
            await message.answer("Ошибка регистрации. Попробуйте позже.")
    except Exception:
        await message.answer("Ошибка соединения с сервером.")
    await state.clear_state()

dp.include_router(router)

async def main():
    await dp.start_polling(bot)

if __name__ == '__main__':
    asyncio.run(main())
