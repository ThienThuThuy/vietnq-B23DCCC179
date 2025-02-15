import React, { useState, useEffect } from "react";
import { Button, Card, Input, Modal, Form, Row, Col } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";

import { Task, initialTasks } from "../../services/Todolist/index";

const TodoList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    } else {
      setTasks(initialTasks);
    }
  }, []);

  const showModal = (task?: Task) => {
    setEditingTask(task || null);
    form.resetFields(); // Reset form trước khi đặt giá trị mới
    if (task) {
      form.setFieldsValue({
        title: task.title,
        description: task.description,
        color: task.color,
      });
    } else {
      form.setFieldsValue({
        title: "",
        description: "",
        color: "#000000",
      });
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (values: Omit<Task, "id">) => {
    try {
      let newTasks;
      if (editingTask) {
        newTasks = tasks.map(t => (t.id === editingTask.id ? { ...t, ...values } : t));
      } else {
        newTasks = [...tasks, { id: Date.now(), ...values }];
      }

      setTasks(newTasks);
      localStorage.setItem("tasks", JSON.stringify(newTasks));  // Lưu vào localStorage
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleDelete = (id: number) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));  // Cập nhật localStorage
  };
  const handleDeleteAll = () => {
    
    setTasks([]);
    localStorage.setItem("tasks", JSON.stringify([]));  // Cập nhật localStorage về rỗng
  };
  return (
    <div style={{ padding: 20, backgroundColor: "#f0f8ff", textAlign: "center" }}>
      <h1>Todo List</h1>
      <Button danger icon={<PlusOutlined />} style={{ marginRight: 20 }} onClick={() => showModal()}>
        Create Task
      </Button>
      <Button danger icon={<PlusOutlined />} onClick={() => handleDeleteAll()}>
        Delete All Task
      </Button>
      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        {Array.isArray(tasks) && tasks.map(task => (
          <Col span={8} key={task.id}>
            <Card title={task.title} bordered={true} style={{ borderTop: `4px solid ${task.color}` }}>
              <p>{task.description}</p>
              <EditOutlined onClick={() => showModal(task)} style={{ marginRight: 8, cursor: "pointer" }} />
              <DeleteOutlined onClick={() => handleDelete(task.id)} style={{ color: "red", cursor: "pointer" }} />
            </Card>
          </Col>
        ))}
      </Row>
      <Modal title={editingTask ? "Edit Task" : "Add Task"} visible={isModalOpen} onCancel={handleCancel} onOk={() => form.submit()}>
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please input the title!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="color"
            label="Color"
            rules={[{ required: true, message: "Please select a color!" }]}
          >
            <Input type="color" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TodoList;