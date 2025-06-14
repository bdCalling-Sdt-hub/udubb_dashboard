import React, { useState } from 'react';
import { Popconfirm, Table, Modal, Spin, Select } from 'antd';
import UserImage from '../../Utils/Sideber/UserImage';
import { Space, Button } from 'antd';
import { IoEyeSharp } from 'react-icons/io5';
import { MdBlock, MdDelete } from 'react-icons/md';
import {
  useDeleteUserMutation,
  useGetAllEmployeeQuery,
} from '../../Redux/services/pagesApisServices/userApis';
import toast from 'react-hot-toast';
import UsernameImage from '../../Utils/Sideber/UserImage';

const ManagerTable = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [role, setRole] = useState('');
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const { data, isLoading } = useGetAllEmployeeQuery({
    page: currentPage,
    ...(role !== '' ? { role } : {}),
  });
  const managerInformation =
    data?.data?.result?.map((user, index) => ({
      key: user._id,
      sl_No: index + 1,
      user: {
        name: user?.name || 'N/A',
        email: user?.email || 'N/A',
        profile_image:
          user?.profile_image ||
          'https://i.ibb.co.com/PsxKbMWH/defult-Image.jpg',
        phoneNumber: user?.phone || 'N/A',
        location: user?.address || 'N/A',
        role: user?.role || 'N/A',
        isBlock: user?.isBlock ? 'Blocked' : 'Active',
        isResetVerified: user?.isResetVerified ? 'Verified' : 'Not Verified',
        isDeleted: user?.isDeleted ? 'Deleted' : 'Active',
        createdAt: user?.createdAt || 'N/A',
        updatedAt: user?.updatedAt || 'N/A',
      },
    })) || [];
  const showUserModal = (record) => {
    setSelectedUser(record.user);
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleDelete = async (key) => {
    const id = key;
    try {
      const res = await deleteUser({ id });
      if (res?.data?.success) {
        setCurrentPage(1);
        toast.success(res?.data?.message || 'Manager deleted successfully.');
      } else {
        toast.error(res?.error?.data?.message || 'Failed to delete Manager.');
      }
    } catch (error) {
      toast.error('Failed to delete Manager.');
    }
  };
  const columns = [
    {
      title: 'Sl no.',
      dataIndex: 'sl_No',
      key: 'sl_No',
      render: (sl_No) => <p>#{sl_No}</p>,
    },
    {
      title: 'Manager Info',
      dataIndex: 'user',
      key: 'user',
      render: (user) => (
        <UsernameImage
          image={user?.profile_image}
          name={user?.name}
          email={user?.email}
        />
      ),
    },
    {
      title: 'Email',
      dataIndex: ['user', 'email'],
      key: 'phoneNumber',
    },
    {
      title: 'Employee Role',
      dataIndex: ['user', 'role'],
      key: 'role',
    },
    {
      title: 'Location',
      dataIndex: ['user', 'location'],
      key: 'location',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            onClick={() => showUserModal(record)}
            type="default"
            shape="circle"
          >
            <IoEyeSharp />
          </Button>
          <Popconfirm
            placement="topLeft"
            title="Confirm Deletion"
            description={
              <p className="text-red-500">
                Are you sure you want to delete this user?
              </p>
            }
            onConfirm={() => handleDelete(record.key)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="default" shape="circle">
              {isDeleting ? <Spin size="small" /> : <MdDelete />}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Select
        placeholder="Select Role"
        style={{ width: 220 }}
        onChange={(value) => setRole(value)}
        allowClear
      >
        <Option value="manager">Manager</Option>
        <Option value="financeManager"></Option>
        <Option value="officeManager">Office Manager</Option>
      </Select>
      <Table
        rowClassName={() => 'table-row'}
        className="mt-2"
        dataSource={managerInformation}
        columns={columns}
        pagination={{
          pageSize: data?.data?.meta?.limit,
          total: data?.data?.meta?.total,
          current: data?.data?.meta?.page,
          onChange: (page) => {
            setCurrentPage(page);
          },
        }}
        loading={isLoading}
        onChange={(page) => {
          setCurrentPage(page.current);
        }}
      />
      <Modal
        title="User Details"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button
            className="!text-white !bg-[#08765F]"
            key="back"
            onClick={handleCancel}
          >
            Close
          </Button>,
        ]}
      >
        {selectedUser && (
          <div>
            <UsernameImage
              image={selectedUser.profile_image}
              name={selectedUser.name}
              email={selectedUser.email}
            />
            <div className="!mt-12">
              <p>
                <strong>Name:</strong> {selectedUser.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p>
                <strong>Phone Number:</strong> {selectedUser.phoneNumber}
              </p>
              <p>
                <strong>Location:</strong> {selectedUser.location}
              </p>
              <p>
                <strong>Role:</strong> {selectedUser.role}
              </p>
              <p>
                <strong>Block Status:</strong> {selectedUser.isBlock}
              </p>
              <p>
                <strong>Reset Verified:</strong> {selectedUser.isResetVerified}
              </p>
              <p>
                <strong>Deleted Status:</strong> {selectedUser.isDeleted}
              </p>
              <p>
                <strong>Created At:</strong>{' '}
                {new Date(selectedUser.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManagerTable;
