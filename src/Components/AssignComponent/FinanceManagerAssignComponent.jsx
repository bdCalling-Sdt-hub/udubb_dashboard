import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Form, Image, Row, Typography } from 'antd';
import { imageUrl } from '../../Utils/server';
import { useGetAllUserQuery } from '../../Redux/services/pagesApisServices/userApis';
import { MdDelete } from 'react-icons/md';
import toast from 'react-hot-toast';
import useProjectsCreate from '../../contexts/hooks/useProjectsCreate';

const { Title, Text } = Typography;

function FinanceManagerAssignComponent({
  setFinanceManagerModal,
  financeManager,
}) {
  const [selectedFinanceManager, setSelectedFinanceManager] = useState(null);
  const { financeManagerAssigned, setFinanceManagerAssigned } =
    useProjectsCreate();

  const {
    data: FinanceManagerData,
    isLoading,
    refetch,
  } = useGetAllUserQuery({
    role: 'financeManager',
    limit: 999,
  });


  const assignedFinanceManagers =
    FinanceManagerData?.data?.result?.filter((manager) =>
      financeManagerAssigned?.includes(manager._id)
    ) || [];


  const AssignLabel = selectedFinanceManager ? 'Change' : 'Assign';

  const handleDelete = async (id) => {
    const updatedList = financeManagerAssigned.filter((item) => item !== id);
    setFinanceManagerAssigned(updatedList);
    toast.success('Finance Manager removed!');
  };

  const handleRemove = () => {
    localStorage.removeItem('financeManager');
    setSelectedFinanceManager(null);
    toast.success('Finance Manager removed!');
    refetch();
  };

  return (
    <div className="mt-2">
      <Card>
        <Row gutter={24} className="!mt-4 items-center">
          <Col span={18}>
            <Form.Item
              label={
                <Title level={5} className="text-gray-700 mb-1">
                  Finance Manager
                </Title>
              }
            >
              <Text className="text-gray-600">
                Please Select Finance Manager
              </Text>
            </Form.Item>
          </Col>
          <Button
            onClick={() => setFinanceManagerModal(true)}
            className={`${
              selectedFinanceManager ? '!bg-[#213555] !text-white' : ''
            } w-fit px-2 py-1 rounded`}
          >
            {AssignLabel}
          </Button>
        </Row>

        {/* Selected finance manager from localStorage */}
        {Array.isArray(selectedFinanceManager) &&
          selectedFinanceManager?.length > 0 && (
            <div className="!mt-4">
              <Card>
                {selectedFinanceManager.map((item, idx) => (
                  <div key={idx} className="mb-3">
                    <div className="!flex !w-full !items-center !justify-between">
                      <div className="flex items-start gap-4">
                        {item?.profile_image && (
                          <Image
                            src={imageUrl(item?.profile_image)}
                            className="!w-16 !h-12 object-cover rounded-md overflow-hidden"
                            alt={item?.name}
                            fallback="https://i.ibb.co.com/PsxKbMWH/defult-Image.jpg"
                          />
                        )}
                        <div>
                          <p className="text-base leading-none">{item?.name}</p>
                          <p className="text-[#808080] leading-none text-sm">
                            {item?.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setFinanceManagerModal(true)}
                          className={`${
                            selectedFinanceManager
                              ? '!bg-[#213555] !text-white'
                              : ''
                          } w-fit px-2 py-1 rounded`}
                        >
                          {AssignLabel}
                        </Button>
                        <Button
                          shape="circle"
                          onClick={handleRemove}
                          className="!bg-white !text-black w-fit px-2 py-1 rounded"
                        >
                          <MdDelete />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </Card>
            </div>
          )}

        {/* Assigned finance managers from financeManagerAssigned */}
        {assignedFinanceManagers.length > 0 && (
          <div className="!mt-4">
            <Card>
              {assignedFinanceManagers.map((item, idx) => (
                <div key={idx} className="mb-3">
                  <div className="!flex !w-full !items-center !justify-between">
                    <div className="flex items-start gap-4">
                      {item?.profile_image && (
                        <Image
                          src={imageUrl(item?.profile_image)}
                          className="!w-16 !h-12 object-cover rounded-md overflow-hidden"
                          alt={item?.name}
                          fallback="https://i.ibb.co.com/PsxKbMWH/defult-Image.jpg"
                        />
                      )}
                      <div>
                        <p className="text-base leading-none">{item?.name}</p>
                        <p className="text-[#808080] leading-none text-sm">
                          {item?.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        shape="circle"
                        onClick={() => handleDelete(item._id)}
                        className="!bg-white !text-black w-fit px-2 py-1 rounded"
                      >
                        <MdDelete />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        )}
      </Card>
    </div>
  );
}

export default FinanceManagerAssignComponent;
