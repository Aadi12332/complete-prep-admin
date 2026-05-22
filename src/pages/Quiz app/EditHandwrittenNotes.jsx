import React, { useEffect, useState } from "react";
import HOC from "../../components/HOC/HOC";

import { GoArrowLeft } from "react-icons/go";
import { useNavigate, useParams } from "react-router-dom";
import { AiFillPlusCircle } from "react-icons/ai";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { AiFillEdit } from "react-icons/ai";
import { useForm } from "react-hook-form";
import {
  addHandwrittenNote,
  addStudyPlannerCourse,
  addTopic,
  addVideo,
  getAllEducatorNotes,
  getAllHandwrittenNotes,
  getAllSubjects,
  getAllSubjectsByGoalExam,
  getAllSubSubjects,
  getAllTopics,
  getAllVideos,
  getGoalCategory,
  getGoalExamByGoalCategory,
  getHandwrittenNoteById,
  getStudyPlannerPlans,
  getTopicsByChapter,
  updateHandwrittenNote,
} from "../../services/exportFunctions";
import FormComponent from "../../services/StudyPlannerFormComponent";
import HandwrittenNotesFormComponent from "../../services/HandwrittenNotesFormComponent";

const EditHandwrittenNotes = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const { register, handleSubmit, watch, reset } = useForm();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [goalExam, setGoalExam] = useState([]);
  const [allGoals, setAllGoals] = useState([]);
  const [subject, setSubject] = useState([]);
  const [subSubjects, setSubSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [topics, setTopics] = useState([]);
  const [isSamePage, setIsSamePage] = useState(false);
  const [handwrittennotes, setHandwrittenNotes] = useState([]);
  const [educatorNotes, setEducatorNotes] = useState([]);
  const [studyplannerStudyPlans, setStudyplannerStudyPlans] = useState([]);
  const [videoData, setVideoData] = useState({});
  const { id } = useParams();
  const [formSubjects, setFormSubjects] = useState([]);

  useEffect(() => {
    getStudyPlannerPlans({
      setIsLoading,
      setData: setStudyplannerStudyPlans,
    });
    getHandwrittenNoteById({
      id,
      setIsLoading,
      setData: (res) => reset({ ...res?.data }),
    });
    getGoalCategory({ setIsLoading, setData });
  }, []);

  const goalCategory = watch("goalCategory");

  useEffect(() => {
    if (goalCategory) {
      const params = {
        page: 1,
        limit: 100,
        search: "",
        goalCategoryId: goalCategory,
      };
      getGoalExamByGoalCategory({ setIsLoading, setData: setAllGoals, params });
    }
  }, [goalCategory]);

  const goalExamId = watch("goal");

  useEffect(() => {
    if (goalExamId) {
      const params = {
        page: 1,
        limit: 100,
        search: "",
        goalCategory,
        goalId: goalExamId,
      };
      getAllSubjects({ setIsLoading, setData: setSubject, params });
    }
  }, [goalExamId]);

  const subjectId = watch("subject");

  useEffect(() => {
    if (subjectId) {
      const params = {
        page: 1,
        limit: 100,
        search: "",
        subjectId,
      };
      getAllSubSubjects({ setIsLoading, setData: setSubSubjects, params });
    }
  }, [subjectId]);

  const subSubjectId = watch("subSubject");

  useEffect(() => {
    console.log("subjectId", subjectId, "subSubjectId", subSubjectId);
    if (subjectId || subSubjectId) {
      const params = {
        page: 1,
        limit: 100,
        search: "",
      };
      if (subjectId) params.subjectId = subjectId;
      if (subSubjectId) params.subSubjectId = subSubjectId;
      getAllSubjectsByGoalExam({ setIsLoading, setData: setChapters, params });
    }
  }, [subjectId, subSubjectId]);

  const chapterId = watch("chapter");

  useEffect(() => {
    if (chapterId) {
      const params = {
        page: 1,
        limit: 100,
        search: "",
        chapterId,
      };
      getTopicsByChapter({ setIsLoading, setData: setTopics, params });
    }
  }, [chapterId]);
  const topicId = watch("topic");

  useEffect(() => {
    if (topicId) {
      const params = {
        page: 1,
        limit: 100,
        search: "",
        topicId,
      };
      getAllVideos({
        setIsLoading,
        setData: (data) => console.log(data?.data?.[0]),
        params,
      });
    }
  }, [topicId]);

  useEffect(() => {
    getAllHandwrittenNotes({
      setIsLoading,
      setData: setHandwrittenNotes,
      params: { limit: 3000 },
    });
  }, []);

  useEffect(() => {
    getAllEducatorNotes({
      setIsLoading,
      setData: setEducatorNotes,
      params: { limit: 3000 },
    });
  }, []);

  const onSubmit = (formData) => {
    const payload = {
      ...formData,
      // subjects: formSubjects,
    };

    // console.log("payload", payload);
    // return;

    console.log("payload", payload);
    const addFun = () => {
      reset();
      if (!isSamePage) navigate("/quizapp/handwritten-notes");
      setIsSamePage(false);
    };

    updateHandwrittenNote({ data: payload, addFun, id });
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="dashboardcontainer">
          <div className="dashboardcontainer-header">
            <h6>Edit HandWritten Note</h6>
            <p>
              <GoArrowLeft
                size={25}
                style={{ cursor: "pointer" }}
                onClick={() => navigate(-1)}
              />
              Quiz App /<span> Edit Handwritten Notes</span>
            </p>
          </div>
          <div className="studentprofile-container">
            <div className="studyplanner-container">
              <div className="addhandwritten-inputs">
                {/* <div className="addhandwritten-input-two-div">
                  <div className="addhandwritten-input">
                    <h6>
                      Goal <span>*</span>
                    </h6>
                    <div className="addhandwritten-inputs-div">
                      <div className="input-container">
                        <select
                          {...register("goalCategory", { required: true })}
                        >
                          <option value="">Select Goal</option>
                          {data?.data?.map((item) => (
                            <option key={item._id} value={item._id}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                        <label htmlFor="">Select Goal</label>
                      </div>
                      <div className="addhandwritten-inputs-icons">
                     
                      </div>
                    </div>
                  </div>
                  <div className="addhandwritten-input">
                    <h6>
                      Goal Exam<span>*</span>
                    </h6>
                    <div className="addhandwritten-inputs-div">
                      <div className="input-container">
                        <select {...register("goal", { required: true })}>
                          <option value="">Select Goal Exam</option>
                          {allGoals?.data?.map((item) => (
                            <option key={item._id} value={item._id}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                        <label htmlFor="">Select Goal Exam</label>
                      </div>
                      <div className="addhandwritten-inputs-icons"></div>
                    </div>
                  </div>
                </div>

                {goalCategory && goalExamId && (
                  <HandwrittenNotesFormComponent
                    goalCategory={goalCategory}
                    goalExamId={goalExamId}
                    setFormSubjects={setFormSubjects}
                  />
                )} */}

                <div className="addhandwritten-input-two-div">
                  <div className="addhandwritten-input">
                    <h6>
                      Topper's Name <span>*</span>
                    </h6>
                    <div className="addhandwritten-inputs-div">
                      <div className="input-container">
                        <input
                          type="text"
                          {...register("topperName", { required: true })}
                        />
                        <label htmlFor="">Enter Topper's Name</label>
                      </div>
                      <div className="addhandwritten-inputs-icons"></div>
                    </div>
                  </div>
                  <div className="addhandwritten-input">
                    <h6>Bundle Name</h6>
                    <div className="addhandwritten-inputs-div">
                      <div className="input-container">
                        <input
                          type="text"
                          {...register("bundleName", { required: true })}
                        />
                        <label htmlFor="">Enter Bundle Name</label>
                      </div>
                      <div className="addhandwritten-inputs-icons"></div>
                    </div>
                  </div>
                </div>
                <div className="addhandwritten-input-two-div">
                  <div className="addhandwritten-input">
                    <h6>
                      Page Count<span>*</span>
                    </h6>
                    <div className="addhandwritten-inputs-div">
                      <div className="input-container">
                        <input
                          type="text"
                          {...register("pagesCount", { required: true })}
                        />
                        <label htmlFor="">Enter Page Count</label>
                      </div>
                      <div className="addhandwritten-inputs-icons"></div>
                    </div>
                  </div>
                  <div className="addhandwritten-input">
                    <h6>Tile Image Link</h6>
                    <div className="addhandwritten-inputs-div">
                      <div className="input-container">
                        <input
                          type="text"
                          {...register("image", { required: true })}
                        />
                        <label htmlFor="">Enter Tile Image Link</label>
                      </div>
                      <div className="addhandwritten-inputs-icons"></div>
                    </div>
                  </div>
                </div>
                <div className="addhandwritten-inputs-div">
                  <div className="addhandwritten-input">
                    <h6>Price</h6>
                    <div className="addhandwritten-inputs-div">
                      <div className="input-container">
                        <input
                          type="number"
                          {...register("price", { required: true })}
                        />
                        <label htmlFor="">Enter Price here</label>
                      </div>
                      <div className="addhandwritten-inputs-icons"></div>
                    </div>
                  </div>
                  <div className="addhandwritten-input">
                    <h6>Duration (hr)</h6>
                    <div className="addhandwritten-inputs-div">
                      <div className="input-container">
                        <input
                          type="text"
                          {...register("duration", { required: true })}
                        />
                        <label htmlFor="">Enter Duration in text</label>
                      </div>
                      <div className="addhandwritten-inputs-icons"></div>
                    </div>
                  </div>
                </div>
                <div className="addhandwritten-inputs-div">
                  <div className="addhandwritten-input">
                    <h6>Show In Handwritten Notes</h6>
                    <div className="addhandwritten-inputs-div">
                      <div className="input-container">
                        <select {...register("isUsed")} required>
                          <option value={false}>Yes</option>
                          <option value={true}>No</option>
                        </select>
                        <label htmlFor="">Want Show In Handwritten Notes</label>
                      </div>
                      <div className="addhandwritten-inputs-icons"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="addhandwritennotes-submit">
              <div className="handwritten-button">
                <button type="submit">Submit</button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default HOC(EditHandwrittenNotes);
