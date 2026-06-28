export interface BreadItem {
  id: string;
  name: string;
  price: number;
  stock: number;
  image: string;
  description: string;
}

export interface CartItem {
  breadId: string;
  quantity: number;
}

export interface OrderInfo {
  phone: string;
  remark: string;
  pickupTime: string;
  items: CartItem[];
  totalAmount: number;
}

export const PICKUP_TIME_SLOTS = [
  "08:00 - 08:30",
  "08:30 - 09:00",
  "09:00 - 09:30",
  "09:30 - 10:00",
  "10:00 - 10:30",
  "10:30 - 11:00",
  "11:00 - 11:30",
  "11:30 - 12:00",
] as const;

export type PickupTimeSlot = (typeof PICKUP_TIME_SLOTS)[number];
