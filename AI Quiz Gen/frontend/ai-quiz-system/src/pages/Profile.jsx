// src/pages/Profile.jsx
import React from "react";
import ScoreDashboard from "../components/User/ScoreDashboard";
import ProfileDashboard from "../components/User/ProfileDashboard";
import ProfileInfoDashboard from "../components/User/ProfileInfoDashboard";

export default function Profile() {
  // Static data (replace with API fetch later)

  return (
    <div className="min-h-screen px-4 md:px-12 py-8">
      <ProfileInfoDashboard/>
      <br />
      <ProfileDashboard/>
      <br />
      <br />
      <ScoreDashboard/>
      
    </div>
  );
}
