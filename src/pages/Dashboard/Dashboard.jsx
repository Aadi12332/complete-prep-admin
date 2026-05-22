import React from "react";
import HOC from "../../components/HOC/HOC";
import { GoHomeFill } from "react-icons/go";
import { FaCalendarDays } from "react-icons/fa6";
import { MdGolfCourse } from "react-icons/md";
import { BsBookFill } from "react-icons/bs";
import { PiBookFill } from "react-icons/pi";
import { PiNotepadFill } from "react-icons/pi";
import { MdHandshake } from "react-icons/md";
import { FaFireFlameCurved } from "react-icons/fa6";
import { BiSolidNews } from "react-icons/bi";
import { FaFilePen } from "react-icons/fa6";
import { BiSolidBookContent } from "react-icons/bi";
import { HiMiniBarsArrowUp } from "react-icons/hi2";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <>
      <div className="dashboardcontainer">
        <div className="dashboardcontainer-header">
          <h6>Dashboard</h6>
          <p>Welcome back to Complete Prep Admin!</p>
        </div>
        <div className="dashboardmain">
          <Link to={"/dashboard/homepage-content"} className="link">
            <div className="dashboardcontent">
              <GoHomeFill />
              <h6>Edit Home Page Content</h6>
            </div>
          </Link>
          {/* <Link to={"/dashboard/studyplanner-AI"} className="link">
            <div className="dashboardcontent">
              <FaCalendarDays />
              <h6>Study Planner AI Page Content</h6>
            </div>
          </Link> */}
          {/* <Link to={"/dashboard/about-exam"} className="link">
            <div className="dashboardcontent">
              <FaFilePen />
              <h6>About Exam Page Content</h6>
            </div>
          </Link> */}
          <Link to={"/dashboard/course-page"} className="link">
            <div className="dashboardcontent">
              <MdGolfCourse />
              <h6>Course Page Content</h6>
            </div>
          </Link>
          {/* <Link to={"/dashboard/homepage-content"} className="link">
            <div className="dashboardcontent">
              <BsBookFill />
              <h6>Test with video Page Content</h6>
            </div>
          </Link> */}
          <Link to={"/dashboard/handwritten-notes"} className="link">
            <div className="dashboardcontent">
              <PiBookFill />
              <h6>Handwritten Notes Page Content</h6>
            </div>
          </Link>
          {/* <Link to={"/dashboard/pyq-with-video-page-content"} className="link">
            <div className="dashboardcontent">
              <PiNotepadFill />
              <h6>PYQ’s with videos Page Content</h6>
            </div>
          </Link> */}
          <Link to={"/dashboard/community"} className="link">
            <div className="dashboardcontent">
              <MdHandshake />
              <h6>Community Page Content</h6>
            </div>
          </Link>
          {/* <Link to={"/dashboard/capsule-courses"} className="link">
            <div className="dashboardcontent">
              <HiMiniBarsArrowUp />
              <h6>Capsule course Page Content</h6>
            </div>
          </Link> */}
          {/* <Link to={"/dashboard/skills"} className="link">
            <div className="dashboardcontent">
              <FaFireFlameCurved />
              <h6>Skills Page Content</h6>
            </div>
          </Link> */}
          <Link to={"/dashboard/current-affairs"} className="link">
            <div className="dashboardcontent">
              <BiSolidNews />
              <h6>Current Affairs Page Content</h6>
            </div>
          </Link>
          <Link to={"/dashboard/landing-page"} className="link">
            <div className="dashboardcontent">
              <BiSolidBookContent />
              <h6>Landing Page Content</h6>
            </div>
          </Link>
          <Link to={"/add-files"} className="link">
            <div className="dashboardcontent">
              <BiSolidBookContent />
              <h6>Upload Files</h6>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default HOC(Dashboard);
