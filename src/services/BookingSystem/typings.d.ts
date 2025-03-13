interface IService {
    id: string;
    name: string;
    price: number;
    duration: number; // Thời gian thực hiện (phút)
}

interface IStaff {
    id: string;
    name: string;
    maxCustomersPerDay: number;
    workingHours: {
        dayOfWeek: number; // 0-6: Chủ nhật - Thứ 7
        startTime: string; // "09:00"
        endTime: string; // "17:00"
    }[];
    services: string[]; // ID của các dịch vụ
}

interface IAppointment {
    id: string;
    customerId: string;
    customerName: string;
    serviceId: string;
    staffId: string;
    date: string; // YYYY-MM-DD
    time: string; // HH:mm
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    createdAt: string;
}

interface IReview {
    id: string;
    appointmentId: string;
    rating: number; // 1-5
    comment: string;
    staffResponse?: string;
    createdAt: string;
}
