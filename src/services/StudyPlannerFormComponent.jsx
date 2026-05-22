import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  getAllSubjects,
  getAllSubSubjects,
  getAllSubjectsByGoalExam,
  getTopicsByChapter,
  getAllVideos,
} from "./exportFunctions";

const FormComponent = ({ goalCategory, goalExamId, setFormSubjects }) => {
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [subSubjectOptions, setSubSubjectOptions] = useState({});
  const [chapterOptions, setChapterOptions] = useState({});
  const [topicOptions, setTopicOptions] = useState({});
  const [videosData, setVideosData] = useState({});

  const { register, handleSubmit, control } = useForm();
  const {
    fields: subjectFields,
    append: appendSubject,
    remove: removeSubject,
  } = useFieldArray({
    control,
    name: "subjects",
  });

  useEffect(() => {
    if (goalExamId) {
      const params = {
        goalCategory,
        goalId: goalExamId,
        page: 1,
        limit: 100,
        search: "",
      };

      getAllSubjects({
        setData: (data) => {
          setSubjectOptions(Array.isArray(data?.data) ? data?.data : []);
        },
        params,
      });
    }
  }, [goalExamId, goalCategory]);

  const handleFieldChange = (
    subjectIndex,
    subIndex,
    chapterIndex,
    name,
    value
  ) => {
    const params = { page: 1, limit: 100, search: "" };

    if (name === "subjectId" && value) {
      params.subjectId = value;
      getAllSubSubjects({
        setData: (data) =>
          setSubSubjectOptions((prev) => ({
            ...prev,
            [subjectIndex]: data?.data || [],
          })),
        params,
      });
      // When a subject changes, update chapterOptions for the subject-level key.
      getAllSubjectsByGoalExam({
        setData: (data) =>
          setChapterOptions((prev) => ({
            ...prev,
            [subjectIndex]: data?.data || [],
          })),
        params,
      });
    }

    if (name === "subSubjectId" && value) {
      params.subSubjectId = value;
      // Use a composite key so chapters for one subsubject don't overwrite others.
      getAllSubjectsByGoalExam({
        setData: (data) =>
          setChapterOptions((prev) => ({
            ...prev,
            [`${subjectIndex}-${subIndex}`]: data?.data || [],
          })),
        params,
      });
    }

    if (name === "chapterId" && value) {
      params.chapterId = value;
      getTopicsByChapter({
        setData: (data) =>
          setTopicOptions((prev) => ({
            ...prev,
            [`${subjectIndex}-${subIndex}-${chapterIndex}`]: data?.data || [],
          })),
        params,
      });
    }

    if (name === "topicId" && value) {
      params.topicId = value;
      getAllVideos({
        setData: (data) => {
          const videoData = {
            courseVideos: [data?.data?.[0]?._id] || [],
            handwrittenNotes:
              [data?.data?.[0]?.handwrittenNotes?.[0]?._id] || [],
            educatorNotes: [data?.data?.[0]?.educatorNotes?.[0]] || [],
            practiceQuestions: [data?.data?.[0]?.practiceQuestions?.[0]] || [],
            previousYearQuestions:
              data?.data?.[0]?.previousYearQuestions?.[0] || [],
            testSeries: data?.data?.[0]?.testSeries?.[0] || null,
            teacher: data?.data?.[0]?.educatorName?._id || null,
          };

          setVideosData((prev) => ({
            ...prev,
            [value]: videoData,
          }));
        },
        params,
      });
    }
  };

  const onSubmit = (data) => {
    const formattedData = data.subjects.map((subject, subjectIndex) => ({
      subject: subject.subjectId,
      subSubjects: subject.subSubjects?.map((sub, subIndex) => {
        const subSubjectData = {
          chapters: sub.chapters?.map((chapter, chapterIndex) => ({
            chapter: chapter.chapterId,
            topics: chapter.topics?.map((topic) => {
              const videoDetails = videosData[topic.topicId] || {};
              return {
                topic: topic.topicId,
                courseVideos: videoDetails.courseVideos || [],
                handwrittenNotes: videoDetails.handwrittenNotes || [],
                educatorNotes: videoDetails.educatorNotes || [],
                practiceQuestions: videoDetails.practiceQuestions || [],
                previousYearQuestions: videoDetails.previousYearQuestions || [],
                testSeries: videoDetails.testSeries
                  ? [videoDetails.testSeries]
                  : [],
                teacher: videoDetails.teacher || null,
              };
            }),
          })),
        };

        if (sub.subSubjectId) {
          subSubjectData.subSubject = sub.subSubjectId;
        }

        return subSubjectData;
      }),
    }));

    setFormSubjects(formattedData);
  };

  return (
    <form style={{ width: "90%" }} onSubmit={handleSubmit(onSubmit)}>
      {subjectFields.map((subject, subjectIndex) => (
        <div key={subject.id}>
          <button
            type="button"
            onClick={() => removeSubject(subjectIndex)}
            style={{ marginRight: "5px", marginBottom: "20px" }}
          >
            ❌
          </button>
          <div className="input-container">
            <select
              {...register(`subjects[${subjectIndex}].subjectId`, {
                required: true,
              })}
              onChange={(e) =>
                handleFieldChange(
                  subjectIndex,
                  null,
                  null,
                  "subjectId",
                  e.target.value
                )
              }
            >
              <option value="">Select Subject</option>
              {subjectOptions?.map((option) => (
                <option key={option._id} value={option._id}>
                  {option.name}
                </option>
              ))}
            </select>
            <label>Select Subject</label>
          </div>

          {/* Pass the whole chapterOptions object */}
          <SubSubjectArray
            control={control}
            register={register}
            subjectIndex={subjectIndex}
            subSubjectOptions={subSubjectOptions[subjectIndex] || []}
            chapterOptions={chapterOptions}
            topicOptions={topicOptions}
            handleFieldChange={handleFieldChange}
          />
        </div>
      ))}

      <button type="button" onClick={() => appendSubject({ subSubjects: [] })}>
        Add Subject
      </button>

      <button type="button" onClick={handleSubmit(onSubmit)}>
        Submit
      </button>
    </form>
  );
};

const SubSubjectArray = ({
  control,
  register,
  subjectIndex,
  subSubjectOptions,
  handleFieldChange,
  chapterOptions,
  topicOptions,
}) => {
  const {
    fields: subFields,
    append: appendSub,
    remove: removeSub,
  } = useFieldArray({
    control,
    name: `subjects[${subjectIndex}].subSubjects`,
  });

  return (
    <div className="mt-4 mb-2">
      {subFields.map((sub, subIndex) => (
        <div key={sub.id}>
          <button
            type="button"
            onClick={() => removeSub(subIndex)}
            style={{ marginRight: "5px", marginBottom: "10px" }}
          >
            ❌
          </button>
          <div className="input-container mt-4 mb-2">
            <select
              {...register(
                `subjects[${subjectIndex}].subSubjects[${subIndex}].subSubjectId`
              )}
              onChange={(e) =>
                handleFieldChange(
                  subjectIndex,
                  subIndex,
                  null,
                  "subSubjectId",
                  e.target.value
                )
              }
            >
              <option value="">Select SubSubject</option>
              {subSubjectOptions?.map((option) => (
                <option key={option._id} value={option._id}>
                  {option.name}
                </option>
              ))}
            </select>
            <label>Select SubSubject</label>
          </div>

          <ChapterArray
            control={control}
            register={register}
            // Use the composite key for chapter options; if not present, fallback to subject-level chapters.
            chapterOptions={
              chapterOptions[`${subjectIndex}-${subIndex}`] ||
              chapterOptions[subjectIndex] ||
              []
            }
            subjectIndex={subjectIndex}
            subIndex={subIndex}
            handleFieldChange={handleFieldChange}
            topicOptions={topicOptions}
          />
        </div>
      ))}
      <button type="button" onClick={() => appendSub({ chapters: [] })}>
        Add SubSubject
      </button>
    </div>
  );
};

const ChapterArray = ({
  control,
  register,
  subjectIndex,
  subIndex,
  handleFieldChange,
  chapterOptions,
  topicOptions,
}) => {
  const {
    fields: chapterFields,
    append: appendChapter,
    remove: removeChapter,
  } = useFieldArray({
    control,
    name: `subjects[${subjectIndex}].subSubjects[${subIndex}].chapters`,
  });

  return (
    <div className="mt-4 mb-2">
      {chapterFields.map((chapter, chapterIndex) => (
        <div key={chapter.id}>
          <button
            type="button"
            onClick={() => removeChapter(chapterIndex)}
            style={{ marginRight: "5px", marginBottom: "10px" }}
          >
            ❌
          </button>
          <div className="input-container">
            <select
              {...register(
                `subjects[${subjectIndex}].subSubjects[${subIndex}].chapters[${chapterIndex}].chapterId`
              )}
              onChange={(e) =>
                handleFieldChange(
                  subjectIndex,
                  subIndex,
                  chapterIndex,
                  "chapterId",
                  e.target.value
                )
              }
            >
              <option value="">Select Chapter</option>
              {chapterOptions?.map((chapter) => (
                <option key={chapter._id} value={chapter._id}>
                  {chapter.name}
                </option>
              ))}
            </select>
            <label>Select Chapter</label>
          </div>

          <TopicArray
            control={control}
            register={register}
            subjectIndex={subjectIndex}
            subIndex={subIndex}
            chapterIndex={chapterIndex}
            handleFieldChange={handleFieldChange}
            topicOptions={topicOptions}
          />
        </div>
      ))}
      <button type="button" onClick={() => appendChapter({ topics: [] })}>
        Add Chapter
      </button>
    </div>
  );
};

const TopicArray = ({
  control,
  register,
  subjectIndex,
  subIndex,
  chapterIndex,
  handleFieldChange,
  topicOptions,
}) => {
  const {
    fields: topicFields,
    append: appendTopic,
    remove: removeTopic,
  } = useFieldArray({
    control,
    name: `subjects[${subjectIndex}].subSubjects[${subIndex}].chapters[${chapterIndex}].topics`,
  });

  const uniqueKey = `${subjectIndex}-${subIndex}-${chapterIndex}`;

  return (
    <div className="mt-4 mb-2">
      {topicFields.map((topic, topicIndex) => (
        <div key={topic.id} className="mt-3">
          <button
            type="button"
            onClick={() => removeTopic(topicIndex)}
            style={{ marginRight: "5px", marginBottom: "10px" }}
          >
            ❌
          </button>
          <div className="input-container">
            <select
              {...register(
                `subjects[${subjectIndex}].subSubjects[${subIndex}].chapters[${chapterIndex}].topics[${topicIndex}].topicId`
              )}
              onChange={(e) =>
                handleFieldChange(
                  subjectIndex,
                  subIndex,
                  chapterIndex,
                  "topicId",
                  e.target.value
                )
              }
            >
              <option value="">Select Topic</option>
              {topicOptions[uniqueKey]?.map((topic) => (
                <option key={topic._id} value={topic._id}>
                  {topic.name}
                </option>
              ))}
            </select>
            <label>Select Topic</label>
          </div>
        </div>
      ))}
      <button
        className="mt-2 mb-2"
        type="button"
        onClick={() => appendTopic({})}
      >
        Add Topic
      </button>
    </div>
  );
};

export default FormComponent;
