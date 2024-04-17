import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Dashboard.css";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("integration");
  const [formData, setFormData] = useState({});
  const [sendData, setSendData] = useState(false); // New state variable to trigger GPT sending

  // useEffect hook to watch formData and sendData
  useEffect(() => {
    if (sendData) {
      sendGPT(formData).then(() => {
        setSendData(false); // Reset trigger after sending
      });
    }
  }, [formData, sendData]); // Depend on formData and sendData
  // const handleTabClick = (tab) => {
  //   setActiveTab(tab);
  // };
  const [loading, setLoading] = useState(false);
  const sendGPT = async (data) => {
    try {
      setLoading(true);

      const response = await fetch("http://localhost:3001/insert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
      });

      const responseData = await response.json(); // Parse JSON response

      if (responseData.success) {
        // Check success on the parsed data
        toast.success("Blog Post Integration successful");
      } else {
        toast.error(
          responseData.message || "An error occurred while posting the article."
        );
      }
    } catch (error) {
      toast.error("Error posting article: " + error.message); // Assuming error is an Error object
    } finally {
      setLoading(false);
    }
  };

  const handleIntegrationNext = (data) => {
    setFormData({ ...formData, ...data });
    setActiveTab("purpose");
  };

  const handlePurposeNext = (data) => {
    setFormData({ ...formData, ...data });
    setActiveTab("blog");
  };

  const handleBlogNext = (data) => {
    setFormData((prevFormData) => ({ ...prevFormData, ...data }));
    setSendData(true); // Set trigger to true to send data
  };

  const Integration = ({ data, onNext }) => {
    const [integrationType, setIntegrationType] = useState(
      data.integrationType || ""
    );
    const [selectedIntegrationType, setSelectedIntegrationType] = useState(
      data.integrationType || ""
    );

    const [wordpressURL, setWordpressURL] = useState(data.wordpressURL || "");
    const [username, setUsername] = useState(data.username || "");
    const [password, setPassword] = useState(data.password || "");

    const [errors, setErrors] = useState({
      integrationType: false,
      wordpressURL: false,
      username: false,
      password: false,
    });

    const handleIntegrationTypeClick = (selectedIntegrationType) => {
      setIntegrationType(selectedIntegrationType);
      setSelectedIntegrationType(selectedIntegrationType);
      setErrors({ ...errors, integrationType: false });
    };

    const handleFirstStepNext = async () => {
      let formIsValid = true;
      const requiredFields = {
        integrationType,
        wordpressURL,
        username,
        password,
      };
      const newErrors = { ...errors };

      Object.keys(requiredFields).forEach((field) => {
        if (!requiredFields[field]) {
          formIsValid = false;
          newErrors[field] = true;
        } else {
          newErrors[field] = false;
        }
      });

      setErrors(newErrors);

      if (formIsValid) {
        try {
          onNext({
            integrationType,
            wordpressURL,
            username,
            password,
          });
        } catch (error) {
          console.error("Title generation failed:", error);
        }
      }
    };

    return (
      <div className="space-y-4">
        <div>
          <label className="text-gray-600 font-semibold block mb-2">
            Integration Type{" "}
            {errors.integrationType && (
              <small className="text-red-500">* Required</small>
            )}
          </label>
          <div className="flex flex-wrap gap-2">
            {["Wordpress"].map((integrationType) => (
              <button
                key={integrationType}
                onClick={() => handleIntegrationTypeClick(integrationType)}
                className={`border border-gray-300 rounded-md px-4 py-2 text-sm hover:bg-gray-100 focus:outline-none ${
                  selectedIntegrationType === integrationType
                    ? "border-indigo-500"
                    : ""
                }`}
              >
                {integrationType}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-gray-600 font-semibold block mb-2">
            Wordpress URL{" "}
            {errors.wordpressURL && (
              <small className="text-red-500">* Required</small>
            )}
          </label>
          <input
            value={wordpressURL}
            onChange={(e) => {
              setWordpressURL(e.target.value);
              setErrors({ ...errors, wordpressURL: false });
            }}
            className={`border ${
              errors.wordpressURL ? "border-red-500" : "border-gray-300"
            } rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline`}
            id="wordpressURL"
            type="text"
            placeholder="https://mywebsite.com"
          />
        </div>

        <div>
          <label className="text-gray-600 font-semibold block mb-2">
            User Name{" "}
            {errors.username && (
              <small className="text-red-500">* Required</small>
            )}
          </label>
          <input
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setErrors({ ...errors, username: false });
            }}
            className={`border ${
              errors.username ? "border-red-500" : "border-gray-300"
            } rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline`}
            id="username"
            type="text"
            placeholder="admin@email.com"
          />
        </div>

        <div>
          <label className="text-gray-600 font-semibold block mb-2">
            Application Password{" "}
            {errors.password && (
              <small className="text-red-500">* Required</small>
            )}
          </label>
          <input
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors({ ...errors, password: false });
            }}
            className={`border ${
              errors.password ? "border-red-500" : "border-gray-300"
            } rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline`}
            id="password"
            type="text"
            placeholder="Pmax123@1*3"
          />
        </div>

        <div className="flex justify-end">
          <button
            className="mt-6 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            onClick={handleFirstStepNext}
          >
            {"Next"}
          </button>
        </div>
      </div>
    );
  };

  const PurposeContent = ({ data, onNext }) => {
    const [targetAudience, setTargetAudience] = useState(
      data.targetAudience || ""
    );
    const [goal, setGoal] = useState(data.goal || "");
    const [postLength, setPostLength] = useState(data.postLength || "");
    const [seoKeywords, setSeoKeywords] = useState(data.seoKeywords || "");
    const [writingVoice, setWritingVoice] = useState(data.writingVoice || "");

    const [selectedGoal, setSelectedGoal] = useState(data.goal || "");
    const [selectedLength, setSelectedLength] = useState(data.postLength || "");
    const [selectedVoice, setSelectedVoice] = useState(data.writingVoice || "");

    const [loading, setLoading] = useState(false);

    const [errors, setErrors] = useState({
      targetAudience: false,
      goal: false,
      postLength: false,
      seoKeywords: false,
      writingVoice: false,
    });

    const handleGoalClick = (selectedGoal) => {
      setGoal(selectedGoal);
      setSelectedGoal(selectedGoal);
      setErrors({ ...errors, goal: false });
    };

    const handleLengthClick = (selectedLength) => {
      setPostLength(selectedLength);
      setSelectedLength(selectedLength);
      setErrors({ ...errors, postLength: false });
    };

    const handleVoiceClick = (selectedVoice) => {
      setWritingVoice(selectedVoice);
      setSelectedVoice(selectedVoice);
      setErrors({ ...errors, writingVoice: false });
    };

    const handleFirstStepNext = async () => {
      let formIsValid = true;
      const requiredFields = {
        targetAudience,
        goal,
        postLength,
        seoKeywords,
        writingVoice,
      };
      const newErrors = { ...errors };

      Object.keys(requiredFields).forEach((field) => {
        if (!requiredFields[field]) {
          formIsValid = false;
          newErrors[field] = true;
        } else {
          newErrors[field] = false;
        }
      });

      setErrors(newErrors);

      if (formIsValid) {
        setLoading(true);

        try {
          onNext({
            targetAudience,
            goal,
            postLength,
            seoKeywords,
            writingVoice,
          });
        } catch (error) {
          console.error("Title generation failed:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    return (
      <div className="space-y-4">
        <div>
          <label className="text-gray-600 font-semibold block mb-2">
            Who is the target audience?{" "}
            {errors.targetAudience && (
              <small className="text-red-500">* Required</small>
            )}
          </label>
          <input
            value={targetAudience}
            onChange={(e) => {
              setTargetAudience(e.target.value);
              setErrors({ ...errors, targetAudience: false });
            }}
            className={`border ${
              errors.targetAudience ? "border-red-500" : "border-gray-300"
            } rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline`}
            id="targetAudience"
            type="text"
            placeholder="Who is the target audience?"
          />
        </div>
        <div>
          <label className="text-gray-600 font-semibold block mb-2">
            What's the format of this article{" "}
            {errors.goal && <small className="text-red-500">* Required</small>}
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              "Promotional",
              "Informational",
              "Narrative story",
              "How to",
              "List Form",
              "Comparison",
            ].map((goal) => (
              <button
                key={goal}
                onClick={() => handleGoalClick(goal)}
                className={`border border-gray-300 rounded-md px-4 py-2 text-sm hover:bg-gray-100 focus:outline-none ${
                  selectedGoal === goal ? "border-indigo-500" : ""
                }`}
              >
                {goal}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-gray-600 font-semibold block mb-2">
            How long should the post be?{" "}
            {errors.postLength && (
              <small className="text-red-500">* Required</small>
            )}
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              "Short (400-600 words)",
              "Medium (600-1000 words)",
              "Large (1000+ words)",
            ].map((length) => (
              <button
                key={length}
                onClick={() => handleLengthClick(length)}
                className={`border border-gray-300 rounded-md px-4 py-2 text-sm hover:bg-gray-100 focus:outline-none ${
                  selectedLength === length ? "border-indigo-500" : ""
                }`}
              >
                {length}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-gray-600 font-semibold block mb-2">
            What SEO keywords should we include?{" "}
            {errors.seoKeywords && (
              <small className="text-red-500">* Required</small>
            )}
          </label>
          <input
            value={seoKeywords}
            onChange={(e) => {
              setSeoKeywords(e.target.value);
              setErrors({ ...errors, seoKeywords: false });
            }}
            className={`border ${
              errors.seoKeywords ? "border-red-500" : "border-gray-300"
            } rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline`}
            id="seoKeywords"
            type="text"
            placeholder="Use tab, or , separate keywords"
          />
        </div>
        <div>
          <label className="text-gray-600 font-semibold block mb-2">
            What voice do you want us to write in?{" "}
            {errors.writingVoice && (
              <small className="text-red-500">* Required</small>
            )}
          </label>
          <div className="flex flex-wrap gap-2">
            {["Excited", "Professional", "Casual", "Funny", "Authority"].map(
              (writingVoice) => (
                <button
                  key={writingVoice}
                  onClick={() => handleVoiceClick(writingVoice)}
                  className={`border border-gray-300 rounded-md px-4 py-2 text-sm hover:bg-gray-100 focus:outline-none ${
                    selectedVoice === writingVoice ? "border-indigo-500" : ""
                  }`}
                >
                  {writingVoice}
                </button>
              )
            )}
          </div>
        </div>
        {/* <div>
          <label className="text-gray-600 font-semibold block mb-2">
            What voice do you want us to write in?{" "}
            {errors.writingVoice && (
              <small className="text-red-500">* Required</small>
            )}
          </label>
          <input
            value={writingVoice}
            onChange={(e) => {
              setWritingVoice(e.target.value);
              setErrors({ ...errors, writingVoice: false });
            }}
            className={`border ${
              errors.writingVoice ? "border-red-500" : "border-gray-300"
            } rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline`}
            id="writingVoice"
            type="text"
            placeholder="Type here..."
          />
        </div> */}
        <div className="flex justify-end">
          <button
            className="mt-6 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            onClick={handleFirstStepNext}
          >
            {loading ? "Generating..." : "Next"}
          </button>
        </div>
      </div>
    );
  };

  const Blog = ({ data, onNext }) => {
    const [quantity, setQuantity] = useState(data.quantity || "");
    const [schedule, setSchedule] = useState(data.schedule || "");
    const [isChecked, setIsChecked] = useState(data.isChecked || false);

    const handleCheckboxChange = () => {
      setIsChecked(!isChecked);
    };

    const [errors, setErrors] = useState({
      quantity: false,
      schedule: false,
    });

    const handleThirdStep = async () => {
      try {
        let formIsValid = true;
        const requiredFields = {
          quantity,
          schedule,
        };
        const newErrors = { ...errors };

        Object.keys(requiredFields).forEach((field) => {
          if (!requiredFields[field]) {
            formIsValid = false;
            newErrors[field] = true;
          } else {
            newErrors[field] = false;
          }
        });

        setErrors(newErrors);

        if (!formIsValid) {
          return;
        }

        onNext({
          quantity,
          schedule,
          isChecked,
        });
      } catch (error) {
        console.log(error);
      }
    };

    return (
      <div className="space-y-4">
        <ToastContainer />

        <div>
          <label className="text-gray-600 font-semibold block mb-2">
            Quantity
            {errors.quantity && (
              <small className="text-red-500">* Required</small>
            )}
          </label>
          <select
            onChange={(e) => setQuantity(e.target.value)}
            value={quantity}
            className={`border w-full rounded py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline ${
              errors.quantity ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select</option>
            {[1, 2, 5, 10, 20, 50, 100].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-gray-600 font-semibold block mb-2">
            Schedule
            {errors.schedule && (
              <small className="text-red-500">* Required</small>
            )}
          </label>
          <select
            onChange={(e) => setSchedule(e.target.value)}
            value={schedule}
            className={`border w-full rounded py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline ${
              errors.schedule ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select</option>
            {[
              "Every min",
              "Every 6 hours",
              "Every 12 hours",
              "Every day",
              "Every week",
              "Every month",
            ].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-1 text-sm text-gray-500">
            All articles will be generated at once in the selected interval.
          </p>
          <p className="mb-1 text-sm text-gray-500">
            Example: If you choose 10 articles every week, 10 articles will be
            generated at once every week.
          </p>
        </div>

        <div>
          <label className="text-gray-600 font-semibold block mb-2">
            Status
          </label>
          <label className="autoSaverSwitch relative inline-flex cursor-pointer select-none items-center">
            <input
              type="checkbox"
              name="autoSaver"
              className="sr-only"
              checked={isChecked}
              onChange={handleCheckboxChange}
            />
            <span
              className={`slider mr-3 flex h-[24px] w-[50px] items-center rounded-full p-1 duration-200 ${
                isChecked ? "bg-indigo-600" : "bg-[#CCCCCE]"
              }`}
            >
              <span
                className={`dot h-[18px] w-[18px] rounded-full bg-white duration-200 ${
                  isChecked ? "translate-x-6" : ""
                }`}
              ></span>
            </span>
            <span className="label flex items-center text-base text-black">
              <span className="pl-1"> {isChecked ? "Active" : "Paused"} </span>
            </span>
          </label>
        </div>

        <div className="flex justify-between items-center">
          <button
            className="px-4 py-2 rounded-md border border-indigo-500 text-indigo-500 text-sm flex items-center"
            onClick={() => setActiveTab("integration")}
          >
            Back
          </button>
          <button
            className="cursor-pointer bg-gradient-to-r from-indigo-600 to-pink-500 text-white px-4 py-2 rounded-md text-sm"
            onClick={handleThirdStep}
            disabled={loading}
          >
            {loading ? (
              <i class="fa-solid fa-spinner fa-spin"></i>
            ) : (
              "Publish Post"
            )}
          </button>
        </div>
      </div>
    );
  };

  const TabWithNumber = ({ number, label, onClick, isActive }) => (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 py-2 px-4 focus:outline-none ${
        isActive
          ? "text-indigo-600 font-semibold border-b-2 border-indigo-600"
          : "text-gray-600 font-semibold hover:text-indigo-500"
      }`}
    >
      <div className="rounded-full bg-gray-300 h-6 w-6 flex items-center justify-center">
        <span className="text-sm font-bold">{number}</span>
      </div>
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex flex-col md:flex-row items-baseline md:items-center justify-start space-x-4 mb-8">
            <TabWithNumber
              number={1}
              label="Integration"
              // onClick={() => handleTabClick("purpose")}
              isActive={activeTab === "integration"}
            />
            <TabWithNumber
              number={2}
              label="Blog Preset"
              // onClick={() => handleTabClick("title")}
              isActive={activeTab === "purpose"}
            />
            <TabWithNumber
              number={3}
              label="Blog Schedule"
              // onClick={() => handleTabClick("title")}
              isActive={activeTab === "blog"}
            />
          </div>
          {activeTab === "integration" && (
            <Integration data={formData} onNext={handleIntegrationNext} />
          )}
          {activeTab === "purpose" && (
            <PurposeContent data={formData} onNext={handlePurposeNext} />
          )}
          {activeTab === "blog" && (
            <Blog data={formData} onNext={handleBlogNext} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
