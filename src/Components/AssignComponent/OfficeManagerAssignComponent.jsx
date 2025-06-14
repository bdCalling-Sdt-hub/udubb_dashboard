import {
  Button,
  Card,
  Col,
  Collapse,
  Form,
  Image,
  Row,
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { imageUrl } from '../../Utils/server';
import { useGetAllUserQuery } from '../../Redux/services/pagesApisServices/userApis';
import { MdDelete } from 'react-icons/md';
import toast from 'react-hot-toast';
import useProjectsCreate from '../../contexts/hooks/useProjectsCreate';

const { Title, Text } = Typography;
const { Panel } = Collapse;

function OfficeManagerAssignComponent({
  setOfficeManagerModal,
  officeManager,
}) {
  const [selectedOfficeManager, setSelectedOfficeManager] = useState([]);
  const { officeManagerAssigned, setOfficeManagerAssigned } =
    useProjectsCreate();
  const {
    data: OfiiceManagerData,
    isLoading,
    refetch,
  } = useGetAllUserQuery({
    role: 'officeManager',
    limit: 999,
  });

  const assignedManagers =
    OfiiceManagerData?.data?.result?.filter((manager) =>
      officeManagerAssigned?.includes(manager._id)
    ) || [];


  const Assign = selectedOfficeManager.length > 0 ? 'Change' : 'Assign';
  const handleDelete = async (id) => {
    const updatedList = officeManagerAssigned.filter((item) => item !== id);
    setOfficeManagerAssigned(updatedList);
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
                  Office Manager
                </Title>
              }
            >
              <Text className="text-gray-600">
                Please Select Office Manager
              </Text>
            </Form.Item>
          </Col>
          {!officeManager && (
            <Button
              onClick={() => setOfficeManagerModal(true)}
              className={`${
                selectedOfficeManager.length > 0
                  ? '!bg-[#213555] !text-white'
                  : ''
              } w-fit px-2 py-1 rounded`}
            >
              {Assign}
            </Button>
          )}
        </Row>
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
        {/* {selectedOfficeManager.length > 0 && (
          <div className="mt-4">
            {selectedOfficeManager.map((item, idx) => (
              <div key={idx}>
                <div className="mb-3">
                  <Card>
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-4">
                        <Image
                          src={imageUrl(item?.profile_image)}
                          className="!w-16 !h-12 object-cover rounded-md overflow-hidden"
                          alt={item?.name}
                          fallback="https://i.ibb.co.com/PsxKbMWH/defult-Image.jpg"
                        />
                        <div>
                          <p className="text-base leading-none">{item?.name}</p>
                          <p className="text-[#808080] leading-none text-sm">
                            {item?.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setOfficeManagerModal(true)}
                          className={`${
                            selectedOfficeManager.length > 0
                              ? '!bg-[#213555] !text-white'
                              : ''
                          } w-fit px-2 py-1 rounded`}
                        >
                          {Assign}
                        </Button>
                        {selectedOfficeManager.length > 0 && (
                          <Button
                            shape="circle"
                            onClick={() => {
                              localStorage.removeItem('officeManager');
                              setSelectedOfficeManager([]);
                              toast.success('Office Manager removed!');
                              refetch();
                            }}
                            className="!bg-white !text-black w-fit px-2 py-1 rounded"
                          >
                            <MdDelete />
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        )} */}
      </Card>
    </div>
  );
}

export default OfficeManagerAssignComponent;
