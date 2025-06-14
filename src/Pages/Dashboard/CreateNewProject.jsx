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
  Modal,
  Select,
  Tag,
} from 'antd';
import { UploadOutlined, CheckOutlined } from '@ant-design/icons';
import { MdDeleteForever } from 'react-icons/md';
import PageHeading from '../../Components/Shared/PageHeading';
import {
  useCreateProjectsMutation,
  useGetSingleProjectQuery,
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
import useProjectsCreate from '../../contexts/hooks/useProjectsCreate';
import { useGetAllSmartShitQuery } from '../../Redux/services/pagesApisServices/smartShitApis';
import moment from 'moment';

const { Title } = Typography;

const CreateNewProject = () => {
  const location = useLocation();
  const id = location?.state;
  const { data: project } = useGetSingleProjectQuery({ id: id });

  const [form] = Form.useForm();
  const [projectImage, setProjectImage] = useState(null);
  const [projectImageUrl, setProjectImageUrl] = useState('');
  const [projectsOwnerModal, setProjectsOwnerModal] = useState(false);
  const [projectsManagerModal, setProjectsManagerModal] = useState(false);
  const [OfficeManagerModal, setOfficeManagerModal] = useState(false);
  const [financeManagerModal, setFinanceManagerModal] = useState(false);
  const { data: smartShit, isLoading: smartShitLoading } =
    useGetAllSmartShitQuery();

  const [locationInput, setLocationInput] = useState('');
  const [locationDropDownItems, setLocationTags] = useState([]);

  useEffect(() => {
    form.resetFields();
    setProjectImage(null);
    setProjectImageUrl('');
    setProjectManagerAssigned([]);
    setOfficeManagerAssigned([]);
    setFinanceManagerAssigned([]);
    setProjectOwnerAssigned([]);
    setLocationTags([]);
  }, []);

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
  const [createProject, { isLoading }] = useCreateProjectsMutation();

  const handleAddLocationTag = () => {
    if (locationInput && !locationDropDownItems.includes(locationInput)) {
      setLocationTags([...locationDropDownItems, locationInput]);
      setLocationInput('');
    } else {
      toast.error('This is already added!');
    }
  };

  const handleRemoveLocationTag = (removedTag) => {
    const newTags = locationDropDownItems.filter((tag) => tag !== removedTag);
    setLocationTags(newTags);
  };

  const onFinish = async (values) => {
    try {
      let formattedDate;
      if (values.projectStartDate) {
        if (
          values.projectStartDate &&
          typeof values.projectStartDate.format === 'function'
        ) {
          formattedDate = values.projectStartDate.format(
            'YYYY-MM-DDTHH:mm:ss.SSS[Z]'
          );
        } else {
          formattedDate = new Date(values.projectStartDate).toISOString();
        }
      } else {
        formattedDate = new Date().toISOString();
      }

      const dataPayload = {
        name: values.projectName,
        address: values.address,
        startDate: formattedDate,
        liveLink: values.liveStreamLink,
        liveLink2: values.liveLink2,
        projectManager: projectManagerAssigned,
        officeManager: officeManagerAssigned,
        financeManager: financeManagerAssigned,
        projectOwner: projectOwnerAssigned,
        locationDropDownItems: locationDropDownItems,
        smartSheetId: values.smartSheetId,
      };

      const formData = new FormData();
      if (projectImage) {
        formData.append('project_images', projectImage);
      }
      formData.append('smartSheetId', values.smartSheetId);
      formData.append('data', JSON.stringify(dataPayload));

      const response = await createProject({ data: formData }).unwrap();
      if (response?.success) {
        toast.success(response?.message || 'Project created successfully.');
        form.resetFields();
        setProjectImage(null);
        setProjectImageUrl('');
        setProjectManagerAssigned([]);
        setOfficeManagerAssigned([]);
        setFinanceManagerAssigned([]);
        setProjectOwnerAssigned([]);
        setLocationTags([]);
        if (
          setProjectImage(null) &&
          setProjectImageUrl('') &&
          setProjectManagerAssigned([]) &&
          setOfficeManagerAssigned([]) &&
          setFinanceManagerAssigned([]) &&
          setProjectOwnerAssigned([])
        ) {
          window.location.reload();
        }
      } else {
        toast.error(response?.data?.message || 'Failed to create project.');
      }
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to create project.');
      console.error('Error creating project:', error);
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
        toast.error('You can only upload image files!');
        return false;
      }
      return false;
    },
    onChange: handleProjectImageChange,
    showUploadList: false,
  };

  // Initialize form values correctly, especially for dates
  const initialProjectData = project?.data || {};
  const initialValues = {
    projectName: initialProjectData.name || '',
    projectTitle: initialProjectData.title || '',
    projectStartDate: initialProjectData.startDate
      ? moment(initialProjectData.startDate)
      : null,
    liveStreamLink: initialProjectData.liveLink || '',
    liveLink2: initialProjectData.liveLink2 || '',
    smartSheetId: initialProjectData.smartSheetId || undefined,
  };

  return (
    <div>
      <PageHeading text={'Back to table'}></PageHeading>
      <Form
        requiredMark={false}
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="!mt-3 p-6"
        initialValues={initialValues}
      >
        <div className="grid grid-cols-1 gap-4">
          <Card>
            <div className="flex gap-3 items-center ">
              <div className="flex-1">
                <Form.Item
                  name="projectImage"
                  label={
                    <Title level={4} className="text-gray-700 mb-2">
                      Add Project Image
                    </Title>
                  }
                >
                  <div>
                    <Card className="h-[300px] relative !border-2 !border-dashed !border-gray-300 flex items-center justify-center overflow-hidden">
                      {projectImageUrl ? (
                        <div className="w-full h-full relative">
                          <img
                            src={projectImageUrl}
                            alt="Project Preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute w-full h-1/2 transform -translate-y-1/2 pointer-events-none flex items-start justify-end bottom-2 !z-[888] right-2">
                            <Button
                              shape="circle"
                              size="small"
                              className="!pointer-events-auto !bg-white !text-black"
                              onClick={() => {
                                setProjectImageUrl('');
                                setProjectImage(null);
                              }}
                            >
                              <MdDeleteForever />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Upload
                          className=" hover:!scale-102 !transition-all flex items-center justify-center !cursor-pointer !absolute !top-0 !left-0 !w-full !h-full !border-2 !border-dashed !border-gray-300"
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
                  </div>
                </Form.Item>
              </div>
              <div className="flex-1 overflow-y-auto">
                <Card className="!mt-2">
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

                  {/* Add Location Tags Field */}
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
                          />
                          <Button
                            type="primary"
                            icon={<CheckOutlined />}
                            onClick={handleAddLocationTag}
                            disabled={!locationInput}
                          />
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {locationDropDownItems.map((tag) => (
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
                            Select smart sheet
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
                            Live Stream Link (2)
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
                    <Col span={24} className="">
                      <Form.Item>
                        <Button
                          type="primary"
                          htmlType="submit"
                          className="w-full py-3 h-auto text-lg font-medium !bg-[#213555] rounded-md"
                          loading={isLoading}
                        >
                          {isLoading ? 'Creating...' : 'Create Project'}
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
            <Card>
              <div className="max-h-[200px] overflow-y-scroll">
                <ProjectsOwonerAssignComponent
                  projectOwnerAssigned={projectOwnerAssigned}
                  setProjectsOwnerModal={setProjectsOwnerModal}
                />
              </div>
            </Card>
            <Card>
              <div className="max-h-[200px] overflow-y-scroll">
                <ProjectsManagerAssignComponent
                  setProjectsManagerModal={setProjectsManagerModal}
                />
              </div>
            </Card>
            <Card>
              <div className="max-h-[200px] overflow-y-scroll">
                <OfficeManagerAssignComponent
                  setOfficeManagerModal={setOfficeManagerModal}
                />
              </div>
            </Card>
            <Card>
              <div className="max-h-[200px] overflow-y-scroll">
                <FinanceManagerAssignComponent
                  setFinanceManagerModal={setFinanceManagerModal}
                />
              </div>
            </Card>
          </div>
        </div>
      </Form>

      <Modal
        open={projectsOwnerModal}
        onCancel={() => setProjectsOwnerModal(false)}
        footer={null}
        width={800}
      >
        <ProjectsWoners
          setProjectsOwnerModal={setProjectsOwnerModal}
          projectOwnerAssigned={projectOwnerAssigned}
          setProjectOwnerAssigned={setProjectOwnerAssigned}
        />
      </Modal>
      <Modal
        open={projectsManagerModal}
        onCancel={() => setProjectsManagerModal(false)}
        footer={null}
        width={800}
      >
        <ProjectsManagerModal
          projectManagerAssigned={projectManagerAssigned}
          setProjectsManagerModal={setProjectsManagerModal}
          setProjectManagerAssigned={setProjectManagerAssigned}
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
          officeManagerAssigned={officeManagerAssigned}
          setOfficeManagerAssigned={setOfficeManagerAssigned}
        />
      </Modal>
      <Modal
        open={financeManagerModal}
        onCancel={() => setFinanceManagerModal(false)}
        footer={null}
        width={800}
      >
        <FinanceMangers
          financeManagerAssigned={financeManagerAssigned}
          setFinanceManagerModal={setFinanceManagerModal}
          setFinanceManagerAssigned={setFinanceManagerAssigned}
        />
      </Modal>
    </div>
  );
};

export default CreateNewProject;
