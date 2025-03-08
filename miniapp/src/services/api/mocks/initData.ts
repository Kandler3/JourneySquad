import { users } from "@/services/api/mocks/UserMocks.ts";
import { travelPlans } from "@/services/api/mocks/TravelPlanMocks.ts";

const userWithIdMinusOne = users.find((u) => u.id === -1);

if (userWithIdMinusOne) {
    (userWithIdMinusOne.activeTravelPlans ??= []).push(travelPlans[0]);
    (userWithIdMinusOne.activeTravelPlans ??= []).push(travelPlans[1]);
} else {
    console.error("Пользователь с id = -1 не найден");
}