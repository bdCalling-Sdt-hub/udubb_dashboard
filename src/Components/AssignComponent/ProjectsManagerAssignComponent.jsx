import { Button, Card, Col, Form, Image, Row, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { imageUrl } from '../../Utils/server';
import { useGetAllUserQuery } from '../../Redux/services/pagesApisServices/userApis';
import { MdDelete } from 'react-icons/md';
import toast from 'react-hot-toast';
import useProjectsCreate from '../../contexts/hooks/useProjectsCreate';

const { Title, Text } = Typography;

function ProjectsManagerAssignComponent({
  setProjectsManagerModal,
  projectManager,
}) {
  const [selectedManager, setSelectedManager] = useState(null);
  const { projectManagerAssigned, setProjectManagerAssigned } =
    useProjectsCreate();

  const {
    data: ManagerData,
    isLoading,
    refetch,
  } = useGetAllUserQuery({
    role: 'manager',
    limit: 999,
  });

  // const id = localStorage.getItem('projectManager');
  // const projectId = id ? JSON.parse(id) : null;

  // Filter managers based on projectManagerAssigned IDs
  const assignedManagers =
    ManagerData?.data?.result?.filter((manager) =>
      projectManagerAssigned?.includes(manager._id)
    ) || [];



  const Assign = selectedManager ? 'Change' : 'Assign';

  const handleDelete = async (id) => {
    const updatedList = projectManagerAssigned.filter((item) => item !== id);
    setProjectManagerAssigned(updatedList);
    toast.success('Project Manager removed!');
  };

  return (
    <div className="mt-2">
      <Card>
        <Row gutter={24} className="!mt-4 items-center">
          <Col span={18}>
            <Form.Item
              label={
                <Title level={5} className="text-gray-700 mb-1">
                  Project Manager
                </Title>
              }
            >
              <Text className="text-gray-600">
                Please Select Project Manager
              </Text>
            </Form.Item>
          </Col>
          <Button
            onClick={() => setProjectsManagerModal(true)}
            className={`${
              selectedManager ? '!bg-[#213555] !text-white' : ''
            } w-fit px-2 py-1 rounded`}
          >
            {Assign}
          </Button>
        </Row>

        {/* Selected manager from localStorage */}
        {Array.isArray(selectedManager) && selectedManager.length > 0 ? (
          <div className="!mt-4">
            <Card>
              {selectedManager.map((item, idx) => (
                <div key={idx} className="mb-3">
                  <div className="!flex !w-full !items-center  !justify-between">
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
                        onClick={() => setProjectsManagerModal(true)}
                        className={`${
                          selectedManager ? '!bg-[#213555] !text-white' : ''
                        } w-fit px-2 py-1 rounded`}
                      >
                        {Assign}
                      </Button>
                      {selectedManager && (
                        <Button
                          shape="circle"
                          onClick={() => {
                            localStorage.removeItem('projectManager');
                            setSelectedManager(null);
                            toast.success('Project Manager removed!');
                            refetch();
                          }}
                          className="!bg-white !text-black w-fit px-2 py-1 rounded"
                        >
                          <MdDelete />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        ) : null}

        {/* Assigned managers from projectManagerAssigned */}
        {assignedManagers.length > 0 && (
          <div className="!mt-4">
            <Card>
              {assignedManagers.map((item, idx) => (
                <div key={idx} className="mb-3">
                  <div className="!flex !w-full !items-center  !justify-between">
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
                      {/* <Button
                        onClick={() => setProjectsManagerModal(true)}
                        className={`${
                          assignedManagers.length
                            ? '!bg-[#213555] !text-white'
                            : ''
                        } w-fit px-2 py-1 rounded`}
                      >
                        {Assign}
                      </Button> */}
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

export default ProjectsManagerAssignComponent;
