import React, { useEffect, useState } from "react";
import { Button, notification } from "antd";
import PageHeading from "../../Components/Shared/PageHeading.jsx";
import JoditComponent from "../../Components/Shared/JoditComponent.jsx";
import { useGetPolicyQuery } from "../../Redux/services/policyApis.js";
import { usePostTermsConditionsMutation } from "../../Redux/services/termsConditionsApis.js";


const PrivacyPolicy = () => {
  const [content, setContent] = useState("");
    const { data, isLoading } = useGetPolicyQuery({});
    const [setDescription, { isLoading: isSubmitting }] =
      usePostTermsConditionsMutation();

    useEffect(() => {
      if (data?.data?.description) {
        setContent(data.data.description);
      }
    }, [data]);

  const handleLogContent = async () => {
    try {
      //   await setDescription({ description: content }).unwrap();
      notification.success({
        message: "Success",
        description: "Terms & Conditions updated successfully!",
      });
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to update Terms & Conditions. Please try again.",
      });
    }
  };

  //   if (isLoading) {
  //     return <p>..loading</p>;
  //   }

  return (
    <>
      {/* heading and back button */}
      <PageHeading text="Privacy Policy" />
      <JoditComponent setContent={setContent} content={content} />

      {/* Button to log content */}
      <Button
        onClick={handleLogContent}
        // disabled={isSubmitting}
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: "10px",
        }}
        className="max-w-48 sidebar-button-black"
      >
        {/* {isSubmitting ? "Submitting..." : "Submit"} */}
        Submit
      </Button>
    </>
  );
};

export default PrivacyPolicy;
