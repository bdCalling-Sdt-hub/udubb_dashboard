import React, { useState } from 'react';
import { useProjectsDocumentQuery } from '../../Redux/services/pagesApisServices/doucmentApis';
import { Link, useLocation } from 'react-router';
import {
  MdOutlineDocumentScanner,
  MdOpenInNew,
  MdExpandMore,
  MdExpandLess,
} from 'react-icons/md';
import {
  Card,
  Empty,
  Spin,
  Pagination,
  Modal,
  Button,
  Row,
  Col,
  Image,
} from 'antd';
import pdf from '../../assets/pdf.png';
import PageHeading from '../Shared/PageHeading';

function AllDocuments() {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedItems, setExpandedItems] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const { data: documentData, isLoading: documentDataLoading } =
    useProjectsDocumentQuery({
      id: location?.state,
      page: currentPage,
      limit: 9,
    });

  const handlePaginationChange = (page) => {
    setCurrentPage(page);
  };


  const openModal = (document) => {
    setSelectedDocument(document);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedDocument(null);
  };

  return (
    <div className="px-4 py-6 bg-white rounded-lg shadow-sm">
      <PageHeading text={'Project Documents'} />
      <div className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
            <MdOutlineDocumentScanner className="inline-block mr-2" />
            All Project Documents
          </h2>
        </div>

        {documentDataLoading ? (
          <div className="flex justify-center p-10">
            <Spin size="large" tip="Loading documents..." />
          </div>
        ) : (
          <div>
            <div>
              {documentData?.data?.result?.length > 0 ? (
                <div className="grid grid-cols-3 gap-6">
                  {documentData?.data?.result?.map((item) => (
                    <Card
                      key={item?._id}
                      className="overflow-hidden shadow-md transition-all duration-300"
                      bodyStyle={{ padding: '16px' }}
                    >
                      <Row gutter={16} align="middle">
                        <Col
                          xs={24}
                          sm={8}
                          md={6}
                          lg={5}
                          className="flex justify-center sm:justify-start"
                        >
                          <Link
                            target="_blank"
                            to={item?.document_url}
                            className="block hover:opacity-80 transition-opacity"
                          >
                            <Image
                              preview={false}
                              className="w-24 h-24 object-contain"
                              src={pdf}
                              alt="PDF document"
                            />
                          </Link>
                        </Col>
                        <Col xs={24} sm={16} md={18} lg={19}>
                          <div className="pt-2 sm:pt-0">
                            <h3 className="text-lg font-medium text-gray-800 mb-1">
                              {item?.title}
                            </h3>
                            <p className="text-sm text-gray-500 mb-3">
                              {new Date(item?.createdAt).toLocaleDateString(
                                'en-US',
                                {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                }
                              )}
                            </p>

                            <div className="text-gray-600">
                              <div>
                                <p className="mb-2 inline-block items-center">
                                  {item?.description?.slice(0, 50)}...
                                </p>
                              </div>
                            </div>
                            <div className="mt-4 flex gap-3">
                              <Button
                                type="primary"
                                onClick={() => openModal(item)}
                                className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700"
                              >
                                View Details
                              </Button>
                              <Link target="_blank" to={item?.document_url}>
                                <Button
                                  className="flex items-center gap-1"
                                  icon={<MdOpenInNew />}
                                >
                                  Open Document
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-10 bg-gray-50 rounded-lg">
                  <Empty description="No project documents available" />
                  <p className="mt-4 text-gray-500">
                    No documents have been uploaded for this project yet.
                  </p>
                </div>
              )}
            </div>

            {/* Pagination Component */}
            {documentData?.data?.meta?.total > 0 && (
              <div className="flex justify-center mt-8">
                <Pagination
                  current={currentPage}
                  pageSize={9}
                  total={documentData?.data?.meta?.total}
                  onChange={handlePaginationChange}
                  showSizeChanger={false}
                />
              </div>
            )}
          </div>
        )}
      </div>

      <Modal
        open={modalVisible}
        onCancel={closeModal}
        footer={[
          <div className="flex items-center justify-end gap-2">
            <Button key="close" onClick={closeModal}>
              Close
            </Button>

            <Link
              key="open"
              target="_blank"
              to={selectedDocument?.document_url}
            >
              <Button type="primary" className="bg-blue-600 hover:bg-blue-700">
                Open Document
              </Button>
            </Link>
          </div>,
        ]}
        width={700}
        centered
        title="Document Details"
      >
        {selectedDocument && (
          <div className="p-2">
            <div className="flex w-32 h-32 justify-center mb-6">
              <Image
                preview={false}
                src={pdf}
                alt="PDF document"
                className=" object-contain w-full h-full"
              />
            </div>
            <div className="bg-gray-50 p-5 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-1">
                {selectedDocument?.title}
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Added on:{' '}
                {new Date(selectedDocument?.createdAt).toLocaleDateString(
                  'en-US',
                  {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }
                )}
              </p>
              <div>
                <p className="text-gray-700 whitespace-pre-line">
                  {selectedDocument?.description}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default AllDocuments;
