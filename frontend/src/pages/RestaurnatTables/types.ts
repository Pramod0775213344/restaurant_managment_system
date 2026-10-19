export interface RestaurantTable {
    id: number;
    tableNo: string;
    capacity: number;
    isAvailable: boolean;
    orderNo?: string | null;
    currentOrderNo?: string | null;
}

export interface RestaurantTableFormData {
    tableNo: string;
    capacity: number;
    isAvailable: boolean;
    orderNo?: string | null;
}