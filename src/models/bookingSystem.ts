
import { useState, useEffect } from 'react';

export default () => {
    const [services, setServices] = useState<IService[]>(() => {
        const loadedServices = localStorage.getItem('booking-services');
        return loadedServices ? JSON.parse(loadedServices) : [];
    });

    const [staff, setStaff] = useState<IStaff[]>(() => {
        const loadedStaff = localStorage.getItem('booking-staff');
        return loadedStaff ? JSON.parse(loadedStaff) : [];
    });

    const [appointments, setAppointments] = useState<IAppointment[]>(() => {
        const loadedAppointments = localStorage.getItem('booking-appointments');
        return loadedAppointments ? JSON.parse(loadedAppointments) : [];
    });

    const [reviews, setReviews] = useState<IReview[]>(() => {
        const loadedReviews = localStorage.getItem('booking-reviews');
        return loadedReviews ? JSON.parse(loadedReviews) : [];
    });

    // Save data to localStorage whenever any of the states change
    useEffect(() => {
        localStorage.setItem('booking-services', JSON.stringify(services));
    }, [services]);

    useEffect(() => {
        localStorage.setItem('booking-staff', JSON.stringify(staff));
    }, [staff]);

    useEffect(() => {
        localStorage.setItem('booking-appointments', JSON.stringify(appointments));
    }, [appointments]);

    useEffect(() => {
        localStorage.setItem('booking-reviews', JSON.stringify(reviews));
    }, [reviews]);

    return {
        services,
        setServices,
        staff,
        setStaff,
        appointments,
        setAppointments,
        reviews,
        setReviews,
    };
};





