import { dormsMockDb } from "@/server/mocks/dorms";
import type { DormDetail, DormListItem, DormSearchParams } from "@/types/dorm";

function normalizeText(value?: string) {
  return (value || "").trim().toLowerCase();
}

export async function getDorms(params: DormSearchParams): Promise<DormListItem[]> {
  const q = normalizeText(params.q);
  const near = normalizeText(params.near);
  const furniture = params.furniture ?? [];

  let result = dormsMockDb.filter((dorm) => {
    const matchKeyword =
      !q ||
      dorm.name.toLowerCase().includes(q) ||
      dorm.location.toLowerCase().includes(q) ||
      dorm.tags.some((tag) => tag.toLowerCase().includes(q)) ||
      dorm.nearby.some((item) => item.name.toLowerCase().includes(q));

    const matchPrice = !params.priceMax || dorm.priceMin <= params.priceMax;
    const matchRoomSize = !params.roomSizeMin || dorm.roomSizeMax >= params.roomSizeMin;
    const matchPet = params.petFriendly ? dorm.petFriendly : true;

    const matchFurniture =
      furniture.length === 0 || furniture.every((f) => dorm.furniture.includes(f));

    const matchNear =
      !near ||
      dorm.nearby.some(
        (item) =>
          item.name.toLowerCase().includes(near) ||
          item.type.toLowerCase() === near
      );

    return (
      matchKeyword &&
      matchPrice &&
      matchRoomSize &&
      matchPet &&
      matchFurniture &&
      matchNear
    );
  });

  result = result.sort((a, b) => {
    if (a.totalAvailableRooms > 0 && b.totalAvailableRooms === 0) return -1;
    if (a.totalAvailableRooms === 0 && b.totalAvailableRooms > 0) return 1;
    return a.priceMin - b.priceMin;
  });

  return result.map((dorm) => ({
    id: dorm.id,
    slug: dorm.slug,
    name: dorm.name,
    location: dorm.location,
    province: dorm.province,
    lat: dorm.lat,
    lng: dorm.lng,
    cover: dorm.cover,
    gallery: dorm.gallery,
    tags: dorm.tags,
    features: dorm.features,
    furniture: dorm.furniture,
    petFriendly: dorm.petFriendly,
    priceMin: dorm.priceMin,
    priceMax: dorm.priceMax,
    roomSizeMin: dorm.roomSizeMin,
    roomSizeMax: dorm.roomSizeMax,
    nearby: dorm.nearby,
    totalAvailableRooms: dorm.totalAvailableRooms,
    realTimeStatus: dorm.realTimeStatus,
  }));
}

export async function getDormByIdOrSlug(identifier: string): Promise<DormDetail | null> {
  return (
    dormsMockDb.find(
      (dorm) => dorm.id === identifier || dorm.slug === identifier
    ) ?? null
  );
}