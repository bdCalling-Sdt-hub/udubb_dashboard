import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  DatePicker,
  Button,
  Upload,
  Row,
  Col,
  Card,
  Typography,
  message,
  Modal,
  Image,
  Tag,
  Select,
} from 'antd';
import { CheckOutlined, UploadOutlined } from '@ant-design/icons';
import { MdDeleteForever } from 'react-icons/md';
import moment from 'moment';
import PageHeading from '../../Components/Shared/PageHeading';
import {
  useGetSingleProjectQuery,
  useUpdateProjectMutation,
} from '../../Redux/services/pagesApisServices/projectApis';
import ProjectsManagerModal from './Projects/Modal/ProjectsManagerModal';
import OfficeManager from './Projects/Modal/OfficeManager';
import FinanceMangers from './Projects/Modal/FinanceMangers';
import ProjectsWoners from './Projects/Modal/ProjectsWoners';
import ProjectsOwonerAssignComponent from '../../Components/AssignComponent/ProjectsOwonerAssignComponent';
import ProjectsManagerAssignComponent from '../../Components/AssignComponent/ProjectsManagerAssignComponent';
import OfficeManagerAssignComponent from '../../Components/AssignComponent/OfficeManagerAssignComponent';
import FinanceManagerAssignComponent from '../../Components/AssignComponent/FinanceManagerAssignComponent';
import { useLocation } from 'react-router';
import toast from 'react-hot-toast';
import { FaRegEdit } from 'react-icons/fa';
import useProjectsCreate from '../../contexts/hooks/useProjectsCreate';
import { useGetAllSmartShitQuery } from '../../Redux/services/pagesApisServices/smartShitApis';

const { Title } = Typography;

const EditProjects = () => {
  const location = useLocation();
  const {
    projectOwnerAssigned,
    setProjectOwnerAssigned,
    projectManagerAssigned,
    setProjectManagerAssigned,
    officeManagerAssigned,
    setOfficeManagerAssigned,
    financeManagerAssigned,
    setFinanceManagerAssigned,
  } = useProjectsCreate();

  const id = location?.state;
  const { data: projectData } = useGetSingleProjectQuery({ id: id });
  const project = projectData?.data;
  const [form] = Form.useForm();
  const [projectImage, setProjectImage] = useState(null);
  const [projectImageUrl, setProjectImageUrl] = useState('');
  const [projectsOwnerModal, setProjectsOwnerModal] = useState(false);
  const [projectsManagerModal, setProjectsManagerModal] = useState(false);
  const [OfficeManagerModal, setOfficeManagerModal] = useState(false);
  const [financeManagerModal, setFinanceManagerModal] = useState(false);
  const [userData, setUserData] = useState({});
  const [locationInput, setLocationInput] = useState('');
  const [locationTags, setLocationTags] = useState([]);
  const [updateProject, { isLoading: updateLoading }] =
    useUpdateProjectMutation();
  const { data: smartShit, isLoading: smartShitLoading } =
    useGetAllSmartShitQuery();

  useEffect(() => {
    if (project) {
      const looseCompareSheet = smartShit?.result?.sheets?.find(
        (sheet) => String(sheet.id) === String(project.smartSheetId)
      );

      form.setFieldsValue({
        projectName: project.name || '',
        address: project.address || '',
        projectStartDate: project.startDate ? moment(project.startDate) : null,
        liveStreamLink: project.liveLink || '',
        liveLink2: project.liveLink2 || '',
        smartSheetId: looseCompareSheet?.id || null,
      });

      if (project.projectImage) {
        setProjectImageUrl(project.projectImage);
      }

      if (project?.locationDropDownItems) {
        setLocationTags(project.locationDropDownItems);
      }

      if (project.projectManager) {
        setProjectManagerAssigned(project.projectManager.map((pm) => pm._id));
      }
      if (project.officeManager) {
        setOfficeManagerAssigned(project.officeManager.map((om) => om._id));
      }
      if (project.financeManager) {
        setFinanceManagerAssigned(project.financeManager.map((fm) => fm._id));
      }
      if (project.projectOwner) {
        setProjectOwnerAssigned(project.projectOwner.map((po) => po._id));
      }
    }
  }, [project, form, smartShit]);

  const handleAddLocationTag = () => {
    if (locationInput && !locationTags.includes(locationInput)) {
      setLocationTags([...locationTags, locationInput]);
      setLocationInput('');
    } else {
      toast.error('This location is already added!');
    }
  };

  const handleRemoveLocationTag = (removedTag) => {
    const newTags = locationTags.filter((tag) => tag !== removedTag);
    setLocationTags(newTags);
  };

  const onFinish = async (values) => {
    try {
      const dataPayload = {
        name: values.projectName,
        title: values.projectTitle,
        startDate: values.projectStartDate
          ? values.projectStartDate.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
          : new Date().toISOString(),
        liveLink: values.liveStreamLink,
        liveLink2: values.liveLink2,
        projectManager: projectManagerAssigned,
        officeManager: officeManagerAssigned,
        financeManager: financeManagerAssigned,
        projectOwner: projectOwnerAssigned,
        locationDropDownItems: locationTags,
        smartSheetId: values.smartSheetId,
      };

      const formData = new FormData();
      if (projectImage) {
        formData.append('project_images', projectImage);
      }
      formData.append('data', JSON.stringify(dataPayload));

      const response = await updateProject({ id, data: formData }).unwrap();
      if (response?.success) {
        toast.success('Project updated successfully!');
      } else {
        toast.error(response?.message || 'Failed to update project');
      }
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update project');
      console.error('Error updating project:', error);
    }
  };

  const handleProjectImageChange = (info) => {
    const file = info.file;
    if (file) {
      setProjectImage(file);
      const url = URL.createObjectURL(file);
      setProjectImageUrl(url);
    }
  };

  const projectImageUploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        return false;
      }
      return false;
    },
    onChange: handleProjectImageChange,
    showUploadList: false,
  };

  const renderManagerTags = (managers) => {
    return managers?.map((manager) => (
      <Tag key={manager._id} color="blue" className="mb-2">
        {manager.name}
      </Tag>
    ));
  };

  return (
    <Card>
      <PageHeading text={'Back to table'}></PageHeading>
      <Form
        requiredMark={false}
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="mt-3"
      >
        <div className="grid grid-cols-1 gap-4">
          <div className="flex gap-3 items-center">
            <div className="flex-1 h-fit overflow-y-auto">
              <Card className="h-full">
                <Form.Item
                  name="projectImage"
                  label={
                    <Title level={4} className="text-gray-700 mb-2">
                      Project Image
                    </Title>
                  }
                >
                  <Card className="!w-full h-64 relative !border-2 !border-dashed !border-gray-300 flex items-center justify-center overflow-hidden">
                    {projectImageUrl ? (
                      <div className="!w-full relative !h-full">
                        <Image
                          preview={false}
                          src={projectImageUrl}
                          alt="Project image"
                          className="!w-full !h-full oop !object-cover"
                        />
                        <div className="absolute top-[25%] !z-[999] right-2">
                          <Button
                            size="small"
                            shape="circle"
                            className="!pointer-events-auto !bg-white  !text-black"
                            onClick={() => {
                              setProjectImageUrl('');
                              setProjectImage(null);
                            }}
                          >
                            <FaRegEdit />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Upload
                        className="hover:!scale-102 !transition-all flex items-center justify-center !cursor-pointer !absolute !top-0 !left-0 !w-full !h-full !border-2 !border-dashed !border-gray-300"
                        {...projectImageUploadProps}
                      >
                        <div className="text-center p-4">
                          <UploadOutlined className="text-4xl text-gray-300" />
                          <div className="mt-2 text-gray-500 font-medium">
                            Upload project image
                          </div>
                        </div>
                      </Upload>
                    )}
                  </Card>
                </Form.Item>
              </Card>
            </div>
            <div className="flex-1 w-full h-full overflow-y-auto">
              <Card className="h-full">
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item
                      name="projectName"
                      label={
                        <Title level={5} className="text-gray-700 mb-1">
                          Project Name
                        </Title>
                      }
                      rules={[
                        {
                          required: true,
                          message: 'Please enter project name',
                        },
                      ]}
                    >
                      <Input
                        placeholder="Enter project name here..."
                        className="rounded-md py-2"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="address"
                      label={
                        <Title level={5} className="text-gray-700 mb-1">
                          Project Address
                        </Title>
                      }
                      rules={[
                        {
                          required: true,
                          message: 'Please enter project address',
                        },
                      ]}
                    >
                      <Input
                        placeholder="Enter project address here..."
                        className="rounded-md py-2"
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={24}>
                    <Form.Item
                      label={
                        <Title level={5} className="text-gray-700 mb-1">
                          Rooms In House
                        </Title>
                      }
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Input
                          value={locationInput}
                          onChange={(e) => setLocationInput(e.target.value)}
                          placeholder="Enter location and press check to add"
                          className="rounded-md py-2 flex-1"
                          onPressEnter={handleAddLocationTag}
                        />
                        <Button
                          type="primary"
                          icon={<CheckOutlined />}
                          onClick={handleAddLocationTag}
                          disabled={!locationInput}
                        />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {locationTags.map((tag) => (
                          <Tag
                            key={tag}
                            closable
                            onClose={() => handleRemoveLocationTag(tag)}
                            className="text-sm py-1 px-2"
                          >
                            {tag}
                          </Tag>
                        ))}
                      </div>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item
                      name="smartSheetId"
                      label={
                        <Title level={5} className="text-gray-700 mb-1">
                          Select Smart Sheet
                        </Title>
                      }
                    >
                      <Select
                        options={
                          smartShit?.result?.sheets?.map((item) => ({
                            label: item?.name,
                            value: item?.id,
                          })) || []
                        }
                        loading={smartShitLoading}
                        placeholder="Select smart sheet"
                        optionFilterProp="label"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="projectStartDate"
                      label={
                        <Title level={5} className="text-gray-700 mb-1">
                          Project Start Date
                        </Title>
                      }
                    >
                      <DatePicker
                        format="DD/MM/YYYY"
                        placeholder="dd/mm/yyyy"
                        className="w-full rounded-md py-2"
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item
                      name="liveStreamLink"
                      label={
                        <Title level={5} className="text-gray-700 mb-1">
                          Live Stream Link
                        </Title>
                      }
                    >
                      <Input
                        type="url"
                        placeholder="link here..."
                        className="rounded-md py-2"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="liveLink2"
                      label={
                        <Title level={5} className="text-gray-700 mb-1">
                          Live Stream Link(2)
                        </Title>
                      }
                    >
                      <Input
                        type="url"
                        placeholder="link here..."
                        className="rounded-md py-2"
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={updateLoading}
                        className="w-full py-3 h-auto text-lg font-medium !bg-[#213555] rounded-md"
                      >
                        Update Project
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
            <Card>
              <div className="h-[400px] overflow-y-scroll">
                <ProjectsOwonerAssignComponent
                  userData={userData}
                  setProjectsOwnerModal={setProjectsOwnerModal}
                  projectOwners={project?.projectOwner}
                />
                <div className="mt-2">
                  {renderManagerTags(project?.projectOwner)}
                </div>
              </div>
            </Card>
            <Card>
              <div className="h-[400px] overflow-y-scroll">
                <ProjectsManagerAssignComponent
                  setProjectsManagerModal={setProjectsManagerModal}
                  projectManagers={project?.projectManager}
                />
                <div className="mt-2">
                  {renderManagerTags(project?.projectManager)}
                </div>
              </div>
            </Card>
            <Card>
              <div className="h-[400px] overflow-y-scroll">
                <OfficeManagerAssignComponent
                  setOfficeManagerModal={setOfficeManagerModal}
                  officeManagers={project?.officeManager}
                />
                <div className="mt-2">
                  {renderManagerTags(project?.officeManager)}
                </div>
              </div>
            </Card>
            <Card>
              <div className="h-[400px] overflow-y-scroll">
                <FinanceManagerAssignComponent
                  setFinanceManagerModal={setFinanceManagerModal}
                  financeManagers={project?.financeManager}
                />
                <div className="mt-2">
                  {renderManagerTags(project?.financeManager)}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Form>

      {/* Modals */}
      <Modal
        open={projectsManagerModal}
        onCancel={() => setProjectsManagerModal(false)}
        footer={null}
        width={800}
      >
        <ProjectsManagerModal
          setProjectsManagerModal={setProjectsManagerModal}
          setProjectManagerAssigned={setProjectManagerAssigned}
          currentManagers={projectManagerAssigned}
        />
      </Modal>
      <Modal
        open={OfficeManagerModal}
        onCancel={() => setOfficeManagerModal(false)}
        footer={null}
        width={800}
      >
        <OfficeManager
          setOfficeManagerModal={setOfficeManagerModal}
          setOfficeManagerAssigned={setOfficeManagerAssigned}
          currentManagers={officeManagerAssigned}
        />
      </Modal>
      <Modal
        open={financeManagerModal}
        onCancel={() => setFinanceManagerModal(false)}
        footer={null}
        width={800}
      >
        <FinanceMangers
          setFinanceManagerModal={setFinanceManagerModal}
          setFinanceManagerAssigned={setFinanceManagerAssigned}
          currentManagers={financeManagerAssigned}
        />
      </Modal>
      <Modal
        open={projectsOwnerModal}
        onCancel={() => setProjectsOwnerModal(false)}
        footer={null}
        width={800}
      >
        <ProjectsWoners
          setUserData={setUserData}
          setProjectsOwnerModal={setProjectsOwnerModal}
          setProjectOwnerAssigned={setProjectOwnerAssigned}
          currentOwners={projectOwnerAssigned}
        />
      </Modal>
    </Card>
  );
};

export default EditProjects;
