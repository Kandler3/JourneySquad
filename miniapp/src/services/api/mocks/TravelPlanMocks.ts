import { TravelPlan } from "@/models/TravelPlan.ts";
import { users } from "@/services/api/mocks/UserMocks.ts";
import { travelPlanTags } from "@/services/api/mocks/TravelPlanTagMocks.ts";
import {TravelPlanPhoto} from "@/models/TravelPlanPhoto.ts";

export const travelPlans: TravelPlan[] = [
    new TravelPlan(
        1,
        "Летнее приключение",
        "Увлекательное путешествие по живописному побережью с теплым морем и золотыми пляжами. Программа включает водные виды спорта, экскурсии и вечерние прогулки вдоль берега.",
        new Date("2025-06-15"),
        new Date("2025-06-22"),
        users[0],
        [travelPlanTags[0], travelPlanTags[3]],
        [
            new TravelPlanPhoto(1, "/photos/photo1.jpg"),
            new TravelPlanPhoto(2, "/photos/photo2.jpg")
        ],
        [users[1], users[2]]
    ),
    new TravelPlan(
        2,
        "Горное восхождение",
        "Экспедиция в горы с неповторимыми пейзажами и сложными тропами. Программа включает походы, ночёвки в палатках и восхождение на вершины.",
        new Date("2025-07-01"),
        new Date("2025-07-10"),
        users[1],
        [travelPlanTags[1], travelPlanTags[4]],
        [ new TravelPlanPhoto(3, "/photos/photo3.jpg") ],
        [users[2], users[3], users[4]]
    ),
    new TravelPlan(
        3,
        "Городской тур",
        "Погружение в ритм большого города с посещением исторических достопримечательностей, музеев и современных арт-пространств. Тур продуман до мелочей для истинных ценителей городской культуры.",
        new Date("2025-05-10"),
        new Date("2025-05-17"),
        users[2],
        [travelPlanTags[2], travelPlanTags[6]],
        [
            new TravelPlanPhoto(4, "/photos/photo4.jpg"),
            new TravelPlanPhoto(5, "/photos/photo5.jpg"),
            new TravelPlanPhoto(6, "/photos/photo6.jpg")
        ],
        [users[0], users[4]]
    ),
    new TravelPlan(
        4,
        "Приключенческий рейс",
        "Невероятное путешествие для любителей острых ощущений. Программа включает сплав по рекам, прогулки по неизведанным тропам и вечерние костры под открытым небом.",
        new Date("2025-08-05"),
        new Date("2025-08-15"),
        users[3],
        [travelPlanTags[3], travelPlanTags[7]],
        [
            new TravelPlanPhoto(7, "/photos/photo7.jpg"),
            new TravelPlanPhoto(8, "/photos/photo8.jpg")
        ],
        [users[1], users[5]]
    ),
    new TravelPlan(
        5,
        "Культурное наследие",
        "Путешествие по местам, где история оживает: посещение древних городов, замков и музеев. Программа насыщена экскурсиями и познавательными лекциями о прошлом регионов.",
        new Date("2025-09-10"),
        new Date("2025-09-20"),
        users[4],
        [travelPlanTags[5], travelPlanTags[8]],
        [ new TravelPlanPhoto(9, "/photos/photo9.jpg") ],
        [users[2], users[6]]
    ),
    new TravelPlan(
        6,
        "Романтический отдых",
        "Идеальное путешествие для пар, мечтающих о романтике и уюте. Программа включает прогулки по живописным местам, ужины при свечах и незабываемые виды заката.",
        new Date("2025-10-01"),
        new Date("2025-10-07"),
        users[5],
        [travelPlanTags[6], travelPlanTags[9]],
        [
            new TravelPlanPhoto(10, "/photos/photo10.jpg"),
            new TravelPlanPhoto(11, "/photos/photo11.jpg")
        ],
        [users[0], users[3]]
    ),
    new TravelPlan(
        7,
        "Семейное путешествие",
        "Отдых для всей семьи с увлекательными развлечениями для детей и взрослых. Программа включает посещения парков, зоопарков и интерактивных музеев.",
        new Date("2025-11-05"),
        new Date("2025-11-12"),
        users[6],
        [travelPlanTags[7], travelPlanTags[4]],
        [ new TravelPlanPhoto(12, "/photos/photo12.jpg") ],
        [users[1], users[2], users[3]]
    ),
    new TravelPlan(
        8,
        "Бюджетное приключение",
        "Путешествие для тех, кто ценит экономию, но не готов отказываться от ярких впечатлений. Программа включает бесплатные экскурсии и недорогие развлечения.",
        new Date("2025-12-01"),
        new Date("2025-12-08"),
        users[7],
        [travelPlanTags[8], travelPlanTags[1]],
        [
            new TravelPlanPhoto(13, "/photos/photo13.jpg"),
            new TravelPlanPhoto(14, "/photos/photo14.jpg"),
            new TravelPlanPhoto(15, "/photos/photo15.jpg")
        ],
        [users[0], users[4]]
    ),
    new TravelPlan(
        9,
        "Люкс тур",
        "Премиальный отдых с высоким уровнем сервиса, эксклюзивными услугами и безупречным комфортом. Программа разработана для тех, кто ценит роскошь и изысканность.",
        new Date("2026-01-15"),
        new Date("2026-01-22"),
        users[8],
        [travelPlanTags[9], travelPlanTags[5]],
        [ new TravelPlanPhoto(16, "/photos/photo16.jpg") ],
        [users[2], users[7]]
    ),
    new TravelPlan(
        10,
        "Зимний отдых",
        "Незабываемый зимний тур с катанием на лыжах, сноуборде и теплыми вечерами у камина. Программа сочетает активный спорт и уютное расслабление.",
        new Date("2026-02-10"),
        new Date("2026-02-17"),
        users[9],
        [travelPlanTags[1], travelPlanTags[4]],
        [
            new TravelPlanPhoto(17, "/photos/photo17.jpg"),
            new TravelPlanPhoto(18, "/photos/photo18.jpg")
        ],
        [users[3], users[6]]
    ),
    new TravelPlan(
        11,
        "Экзотический тур",
        "Погружение в атмосферу экзотических стран с их яркими традициями и колоритной кухней. Вас ждут экскурсии, пляжи и местные праздники.",
        new Date("2026-03-05"),
        new Date("2026-03-12"),
        users[0],
        [travelPlanTags[0], travelPlanTags[5]],
        [ new TravelPlanPhoto(19, "/photos/photo19.jpg") ],
        [users[4], users[5]]
    ),
    new TravelPlan(
        12,
        "Приключение в лесу",
        "Походы по густым лесам с ночёвками под звёздным небом. Программа включает разведение костра, рассказы о местных легендах и утренние прогулки.",
        new Date("2026-04-10"),
        new Date("2026-04-17"),
        users[1],
        [travelPlanTags[3], travelPlanTags[7]],
        [
            new TravelPlanPhoto(20, "/photos/photo20.jpg"),
            new TravelPlanPhoto(21, "/photos/photo21.jpg")
        ],
        [users[0], users[2], users[8]]
    ),
    new TravelPlan(
        13,
        "Отдых на природе",
        "Идеальная возможность отдохнуть вдали от городской суеты, насладиться свежим воздухом и тишиной природы. Программа включает пикники, прогулки и активный отдых на свежем воздухе.",
        new Date("2026-05-15"),
        new Date("2026-05-22"),
        users[2],
        [travelPlanTags[4], travelPlanTags[8]],
        [ new TravelPlanPhoto(22, "/photos/photo22.jpg") ],
        [users[3], users[7]]
    ),
    new TravelPlan(
        14,
        "Экспедиция за мечтой",
        "Долгожданное путешествие для искателей новых впечатлений. В программе – посещение уникальных мест, знакомство с редкими культурами и незабываемые приключения.",
        new Date("2026-06-01"),
        new Date("2026-06-10"),
        users[3],
        [travelPlanTags[3], travelPlanTags[6]],
        [
            new TravelPlanPhoto(23, "/photos/photo23.jpg"),
            new TravelPlanPhoto(24, "/photos/photo24.jpg"),
            new TravelPlanPhoto(25, "/photos/photo25.jpg")
        ],
        [users[1], users[9]]
    ),
    new TravelPlan(
        15,
        "Кулинарный тур",
        "Путешествие для гурманов с посещением лучших ресторанов, мастер-классами от известных шеф-поваров и дегустациями местных деликатесов.",
        new Date("2026-07-10"),
        new Date("2026-07-17"),
        users[4],
        [travelPlanTags[5], travelPlanTags[7]],
        [ new TravelPlanPhoto(26, "/photos/photo26.jpg") ],
        [users[0], users[2], users[5]]
    ),
    new TravelPlan(
        16,
        "Ночной город",
        "Погружение в ритм ночного мегаполиса с его огнями, клубами и атмосферными улицами. Программа включает экскурсии, ночные прогулки и посещение концертных площадок.",
        new Date("2026-08-15"),
        new Date("2026-08-22"),
        users[5],
        [travelPlanTags[2], travelPlanTags[9]],
        [
            new TravelPlanPhoto(27, "/photos/photo27.jpg"),
            new TravelPlanPhoto(28, "/photos/photo28.jpg")
        ],
        [users[1], users[6]]
    ),
    new TravelPlan(
        17,
        "Пляжный отдых",
        "Идеальный вариант для любителей солнца и моря. Вас ждут расслабляющие дни на пляже, водные развлечения и прогулки вдоль побережья.",
        new Date("2026-09-05"),
        new Date("2026-09-12"),
        users[6],
        [travelPlanTags[0], travelPlanTags[4]],
        [ new TravelPlanPhoto(29, "/photos/photo29.jpg") ],
        [users[3], users[8]]
    ),
    new TravelPlan(
        18,
        "Путешествие мечты",
        "Эксклюзивное путешествие, которое объединяет комфорт и приключения. Программа разработана для тех, кто стремится открыть для себя новые горизонты и незабываемые маршруты.",
        new Date("2026-10-10"),
        new Date("2026-10-17"),
        users[7],
        [travelPlanTags[9], travelPlanTags[5]],
        [
            new TravelPlanPhoto(30, "/photos/photo30.jpg"),
            new TravelPlanPhoto(31, "/photos/photo31.jpg")
        ],
        [users[0], users[2], users[4]]
    ),
    new TravelPlan(
        19,
        "Поездка в горы",
        "Активный тур для любителей спорта и приключений. Программа включает треккинг, скалолазание и велосипедные маршруты по живописным горным дорогам.",
        new Date("2026-11-01"),
        new Date("2026-11-08"),
        users[8],
        [travelPlanTags[1], travelPlanTags[8]],
        [
            new TravelPlanPhoto(32, "/photos/photo32.jpg"),
            new TravelPlanPhoto(33, "/photos/photo33.jpg"),
            new TravelPlanPhoto(34, "/photos/photo34.jpg")
        ],
        [users[1], users[5]]
    ),
    new TravelPlan(
        20,
        "Городской отдых",
        "Путешествие для тех, кто хочет открыть для себя новые грани городской жизни. В программе – экскурсии, шопинг и посещение культурных мероприятий в сердце мегаполиса.",
        new Date("2026-12-05"),
        new Date("2026-12-12"),
        users[9],
        [travelPlanTags[2], travelPlanTags[7]],
        [ new TravelPlanPhoto(35, "/photos/photo35.jpg") ],
        [users[2], users[4], users[7]]
    ),
];
