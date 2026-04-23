import { TicketCategory } from "@/types/ticketCategory";

const g = globalThis as unknown as {
  __ticketCategories?: TicketCategory[];
};

if (!g.__ticketCategories) {
  g.__ticketCategories = [
    { categoryId: "1", categoryName: "Regular", quota: 300, price: 100000, eventId: "1" },
    { categoryId: "2", categoryName: "VIP", quota: 100, price: 250000, eventId: "1" },

    { categoryId: "3", categoryName: "Regular", quota: 500, price: 150000, eventId: "2" },
    { categoryId: "4", categoryName: "VIP", quota: 150, price: 400000, eventId: "2" },
    { categoryId: "5", categoryName: "VVIP", quota: 50, price: 750000, eventId: "2" },

    { categoryId: "6", categoryName: "Festival", quota: 700, price: 120000, eventId: "3" },
    { categoryId: "7", categoryName: "Premium", quota: 200, price: 300000, eventId: "3" },

    { categoryId: "8", categoryName: "Regular", quota: 250, price: 90000, eventId: "4" },
    { categoryId: "9", categoryName: "VIP", quota: 80, price: 200000, eventId: "4" },

    { categoryId: "10", categoryName: "Tribune", quota: 400, price: 110000, eventId: "5" },
    { categoryId: "11", categoryName: "Festival", quota: 250, price: 175000, eventId: "5" },
    { categoryId: "12", categoryName: "VIP", quota: 100, price: 350000, eventId: "5" },

    { categoryId: "13", categoryName: "Regular", quota: 350, price: 130000, eventId: "6" },
    { categoryId: "14", categoryName: "VIP", quota: 120, price: 320000, eventId: "6" },
  ];
}

export const ticketCategories = g.__ticketCategories!;