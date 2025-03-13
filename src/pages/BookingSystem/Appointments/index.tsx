import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Table, Button, Modal, Form, Input, Select, DatePicker, TimePicker, message, Rate, Tag } from 'antd';
import { useModel } from 'umi';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const Appointments: React.FC = () => {
    const { appointments, setAppointments, services, staff, reviews, setReviews } = useModel('bookingSystem');
    const [visible, setVisible] = useState(false);
    const [form] = Form.useForm();
    const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);

    const getDayOfWeek = (day: number) => {
        const days = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
        return days[day] || 'Không xác định';
    };


    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    const id = array[0].toString();


    const handleSubmit = async (values: any) => {
        console.log('Form values:', values);

        // Kiểm tra nếu `values.date` không tồn tại thì đặt giá trị mặc định
        const formattedDate = values.date ? values.date.format('YYYY-MM-DD') : null;

        // Tách `timeId` thành ngày, giờ bắt đầu, giờ kết thúc
        const [dayOfWeek, startTime, endTime] = values.timeId.split('-');

        const newAppointment = {
            id: id,
            ...values,
            date: formattedDate,  // Dùng giá trị đã kiểm tra
            time: `${startTime} - ${endTime}`,  // Lưu khoảng thời gian
            status: 'pending',
            createdAt: new Date().toISOString(),
        };

        setAppointments([...appointments, newAppointment]);
        message.success('Đặt lịch thành công!');
        setVisible(false);
        form.resetFields();
    };


    const handleComplete = (record: any) => {
        setAppointments(appointments.map((app) => (app.id === record.id ? { ...app, status: 'completed' } : app)));
        message.success('Đã hoàn thành lịch hẹn!');
    };

    const handleReview = (record: any) => {
        Modal.confirm({
            title: 'Đánh giá dịch vụ',
            content: (
                <Form form={form}>
                    <Form.Item name='rating' label='Đánh giá'>
                        <Rate />
                    </Form.Item>
                    <Form.Item name='comment' label='Nhận xét'>
                        <Input.TextArea rows={4} />
                    </Form.Item>
                </Form>
            ),
            onOk: async () => {
                const values = await form.validateFields();
                const newReview = {
                    id: id,
                    appointmentId: record.id,
                    rating: values.rating,
                    comment: values.comment,
                    createdAt: new Date().toISOString(),
                };
                setReviews([...reviews, newReview]);
                message.success('Đánh giá thành công!');
                form.resetFields();
            },
        });
    };

    const handleCancel = (record: any) => {
        Modal.confirm({
            title: 'Xác nhận hủy lịch hẹn',
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có chắc chắn muốn hủy lịch hẹn này không?',
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onOk: () => {
                setAppointments(appointments.map((app) => (app.id === record.id ? { ...app, status: 'cancelled' } : app)));
                message.success('Đã hủy lịch hẹn!');
            },
        });
    };

    const columns = [
        {
            title: 'Khách hàng',
            dataIndex: 'customerName',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'customerPhone',
        },
        {
            title: 'Dịch vụ',
            dataIndex: 'serviceId',
            render: (serviceId: string) => services.find((s) => s.id === serviceId)?.name,
        },
        {
            title: 'Nhân viên',
            dataIndex: 'staffId',
            render: (staffId: string) => staff.find((s) => s.id === staffId)?.name,
        },
        {
            title: 'Thời gian',
            dataIndex: 'timeId',
            render: (timeId: string) => {
                if (!timeId) return 'Chưa chọn thời gian';

                // Tách `timeId` thành các phần
                const [dayOfWeek, startTime, endTime] = timeId.split('-');

                return (
                    <div>
                        <b>{getDayOfWeek(parseInt(dayOfWeek))}:</b> {startTime} - {endTime}
                    </div>
                );
            },
        },


        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (status: string) => {
                const statusMap = {
                    pending: 'Chờ duyệt',
                    confirmed: 'Đã xác nhận',
                    completed: 'Hoàn thành',
                    cancelled: 'Đã hủy',
                };
                return <Tag color={getStatusColor(status)}>{statusMap[status as keyof typeof statusMap]}</Tag>;
            },
            filters: [
                { text: 'Chờ duyệt', value: 'pending' },
                { text: 'Đã xác nhận', value: 'confirmed' },
                { text: 'Hoàn thành', value: 'completed' },
                { text: 'Đã hủy', value: 'cancelled' },
            ],
            onFilter: (value: string | number | boolean, record: IAppointment) => record.status === value,
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_: any, record: IAppointment) => {
                const actions = [];

                switch (record.status) {
                    case 'pending':
                        actions.push(
                            <Button
                                key='confirm'
                                type='link'
                                onClick={() => {
                                    setAppointments(
                                        appointments.map((app) => (app.id === record.id ? { ...app, status: 'confirmed' } : app)),
                                    );
                                    message.success('Đã xác nhận lịch hẹn!');
                                }}
                            >
                                Xác nhận
                            </Button>,
                            <Button key='cancel' type='link' danger onClick={() => handleCancel(record)}>
                                Hủy
                            </Button>,
                        );
                        break;
                    case 'confirmed':
                        actions.push(
                            <Button key='complete' type='link' onClick={() => handleComplete(record)}>
                                Hoàn thành
                            </Button>,
                            <Button key='cancel' type='link' danger onClick={() => handleCancel(record)}>
                                Hủy
                            </Button>,
                        );
                        break;
                    case 'completed':
                        if (!reviews.find((r) => r.appointmentId === record.id)) {
                            actions.push(
                                <Button key='review' type='link' onClick={() => handleReview(record)}>
                                    Đánh giá
                                </Button>,
                            );
                        }
                        break;
                    case 'cancelled':
                        actions.push(<Tag color='red'>Đã hủy</Tag>);
                        break;
                }

                return actions;
            },
        },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'orange';
            case 'confirmed':
                return 'blue';
            case 'completed':
                return 'green';
            case 'cancelled':
                return 'red';
            default:
                return 'default';
        }
    };

    return (
        <PageContainer>
            <Card>
                <Button type='primary' onClick={() => setVisible(true)}>
                    Đặt lịch mới
                </Button>
                <Table columns={columns} dataSource={appointments} rowKey='id' pagination={{ pageSize: 10 }} />
            </Card>

            <Modal title='Đặt lịch hẹn' visible={visible} onCancel={() => setVisible(false)} onOk={() => form.submit()}>
                <Form form={form} onFinish={handleSubmit}>
                    <Form.Item name='customerName' label='Tên khách hàng' rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name='customerPhone' label='Số điện thoại' rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name='serviceId' label='Dịch vụ' rules={[{ required: true }]}>
                        <Select>
                            {services.map((service) => (
                                <Select.Option key={service.id} value={service.id}>
                                    {service.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name='staffId' label='Nhân viên' rules={[{ required: true }]}>
                        <Select onChange={(value) => setSelectedStaffId(value)}>
                            {staff.map((s) => (
                                <Select.Option key={s.id} value={s.id}>
                                    {s.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>



                    <Form.Item name="timeId" label="Chọn thời gian" rules={[{ required: true }]} >
                        <Select disabled={!selectedStaffId}>
                            {staff.find((s) => s.id === selectedStaffId)
                                ?.workingHours
                                .filter((slot) => {

                                    // Kiểm tra xem timeId trong appointments có khớp không
                                    const isBooked = appointments.some((appointment) => {
                                        return (
                                            appointment.staffId === selectedStaffId
                                            &&
                                            ['pending', 'confirmed'].includes(appointment.status)
                                        );
                                    });

                                    return !isBooked; // Chỉ giữ lại slot chưa đặt
                                })
                                .map((slot) => {
                                    const timeKey = `${slot.dayOfWeek}-${slot.startTime}-${slot.endTime}`;
                                    return (
                                        <Select.Option key={timeKey} value={timeKey}>
                                            {getDayOfWeek(slot.dayOfWeek)}: {slot.startTime} - {slot.endTime}
                                        </Select.Option>
                                    );
                                }) || []
                            }
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </PageContainer>
    );
};

export default Appointments;