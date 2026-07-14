import { useEffect, useState } from "react";

import { getProfile } from "../../api/userApi";
import CandidateProfileForm from "../../components/candidate/CandidateProfileForm";
import ErrorMessage from "../../components/common/ErrorMessage";
import Loader from "../../components/common/Loader";
import PageHeader from "../../components/common/PageHeader";

export default function CandidateProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getProfile();
      setProfile(response?.data?.user || null);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to load profile."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return <Loader label="Loading profile..." />;
  }

  if (error) {
    return (
      <ErrorMessage message={error} onRetry={loadProfile} />
    );
  }

  return (
    <div>
      <PageHeader
        title="My Profile"
        description="Manage your professional information, skills, education, experience, and resume."
      />

      <CandidateProfileForm profile={profile} />
    </div>
  );
}