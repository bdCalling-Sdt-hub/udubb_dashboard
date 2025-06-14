import React, { memo, useState } from 'react';
import PageHeading from '../../../Components/Shared/PageHeading.jsx';
import { Button, Form, Input, Modal, Select } from 'antd';
import { FaPlus } from 'react-icons/fa';
import ManagerTable from '../../../Components/Tables/ManagerTable.jsx';
import { useCreateUserMutation } from '../../../Redux/services/pagesApisServices/userApis.js';
import toast from 'react-hot-toast';

const EmployeesManage = () => {
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();
  const [createManager, { isLoading: isCreating }] = useCreateUserMutation();
  const handleSubmit = async () => {
    form.validateFields().then(async (values) => {
      const data = {
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
      };
      try {
        await createManager({ data })
          .unwrap()
          .then((res) => {
            if (res?.success) {
              toast.success(res?.message || 'User created successfully.');
              form.resetFields();
              setShowModal(false);
            }else{
              toast.error(res?.message || 'Failed to create user.');
            }
          });
      } catch (error) {
        toast.error(error?.data?.message || 'Failed to create user.');
      }
    });
  };
  return (
    <div className="bg-[var(--black-200)] p-2 rounded mt-4 text-[var(--white-600)]">
      <div className="between-center">
        <PageHeading text={'Employees Management'}></PageHeading>
        <Button
          onClick={() => setShowModal(true)}
          className="!bg-[#213555] !text-white !px-6 !py-5"
        >
          <FaPlus /> Add New Employee
        </Button>
      </div>
      <ManagerTable />
      <Modal
        title="Add New Employee"
        centered
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
      >
        <Form
          requiredMark={false}
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
        >
          <Form.Item
            rules={[{ required: true, message: 'Name is required' }]}
            label="Name"
            name="name"
          >
            <Input type="name" placeholder="Name" />
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: 'Email is required' }]}
            label="Email"
            name="email"
          >
            <Input type="email" placeholder="Email" />
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: 'Password is required' }]}
            label="Password"
            name="password"
          >
            <Input.Password type="password" placeholder="Password" />
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: 'Employee Type is required' }]}
            label="Employee Type"
            name="role"
          >
            <Select placeholder="Select Employee Type">
              <Select.Option value="manager">Manager</Select.Option>
              <Select.Option value="officeManager">
                Office Manager
              </Select.Option>
              <Select.Option value="financeManager">
                Finance Manager
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button
              htmlType="submit"
              className="!bg-[#213555] !text-white !px-6 !py-5"
            >
              {isCreating ? <span className="loader"></span> : 'Create'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default memo(EmployeesManage);
