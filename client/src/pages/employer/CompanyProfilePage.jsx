import { useEffect, useState } from "react";

import { getProfile } from "../../api/userApi";
import ErrorMessage from "../../components/common/ErrorMessage";
import Loader from "../../components/common/Loader";
import PageHeader from "../../components/common/PageHeader";
import CompanyProfileForm from "../../components/employer/CompanyProfileForm";

export default function CompanyProfilePage() {
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
          "Unable to load company profile."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return <Loader label="Loading company profile..." />;
  }

  if (error) {
    return (
      <ErrorMessage message={error} onRetry={loadProfile} />
    );
  }

  return (
    <div>
      <PageHeader
        title="Company Profile"
        description="Manage company information displayed on job posts."
      />

      <CompanyProfileForm profile={profile} />
    </div>
  );
}