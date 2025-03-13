export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'FullscreenExitOutlined',
	},
	{
		path: '/todo-list',
		name: 'Todolist',
		component: './TodoList',
		icon: 'FullscreenExitOutlined',
	},
	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/booking-system',
		name: 'Quản lý đặt lịch',
		icon: 'CalendarOutlined',
		routes: [
			{
				path: 'appointments',
				name: 'Quản lý lịch hẹn',
				component: './BookingSystem/Appointments',
				icon: 'ScheduleOutlined',
			},
			{
				path: 'staff',
				name: 'Quản lý nhân viên',
				component: './BookingSystem/Staff',
				icon: 'TeamOutlined',
			},
			{
				path: 'services',
				name: 'Quản lý dịch vụ',
				component: './BookingSystem/Services',
				icon: 'ShopOutlined',
			},
			{
				path: 'reviews',
				name: 'Đánh giá',
				component: './BookingSystem/Reviews',
				icon: 'StarOutlined',
			},
			{
				path: 'statistics',
				name: 'Thống kê',
				component: './BookingSystem/Statistics',
				icon: 'BarChartOutlined',
			},
		],
	},

	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
