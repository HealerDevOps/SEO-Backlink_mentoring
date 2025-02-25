"use client";

import Sidebar from "../../components/common/Sidebar";
import { FaSearch, FaFolderOpen, FaLink, FaGoogle } from "react-icons/fa";
import { FaGauge } from "react-icons/fa6";
import { TbRadarFilled } from "react-icons/tb";
import { useSidebar } from "../../context/SidebarContext";
import { useAuth } from "../../hooks/useAuth";
import { useUser } from "../../context/UserContext";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

// Lazy imports for performance optimization
import dynamic from "next/dynamic";
import { usePlan } from "../../context/UserPlanContext";
const KeywordSearch = dynamic(() => import("./keyword-search/page"));
const BulkSearch = dynamic(() => import("./bulk-search/page"));
const CompetitiveAnalysis = dynamic(() => import("./competitive-analysis/page"));
const SerpScanner = dynamic(() => import("./serp-scanner/page"));
const ExpiredDomains = dynamic(() => import("./expired-domains/page"));
const Projects = dynamic(() => import("./projects/page"));
const AccountSettings = dynamic(() => import("./account-settings/page"));
const PricingTable = dynamic(() => import("./quota/page"));

export default function Home() {
  const { user, refreshUser } = useUser();
  const { selectedMenuItem, setSelectedMenuItem } = useSidebar();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [userFeatures, setUserFeatures] = useState([]);
  const { selectedPlanId, selectedPlanName, setPlan, clearPlan } = usePlan();

  // Redirect if user is not authenticated
  useEffect(() => {
    if (!user) router.push("/auth/signin");
  }, [user, router]);

  // API call to save subscription
  const saveSubscription = useCallback(
    async (subscriptionId: string, planId: string, planName: string, email: string) => {
      try {
        console.log("🔵 Sending subscription request:", { subscriptionId, planId, planName, email });

        const response = await fetch("/api/save-subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subscriptionId, planId, planName, userEmail: email }),
        });

        const data = await response.json();

        if (!response.ok) throw new Error("Failed to save subscription");


        return data.features || null;
      } catch (error) {
        console.error("Failed to save subscription:", error);
        return null;
      }
    },
    []
  );

  // Handle subscription updates
  useEffect(() => {
    const subscriptionId = searchParams?.get("subscription_id");

    if (!user || !subscriptionId) return;

    let { email } = user;
    let planId = selectedPlanId;
    let planName = selectedPlanName;

    if (!email || !planId || !planName) {
      const userSession = sessionStorage.getItem("user");
      if (userSession) {
        const parsedSession = JSON.parse(userSession);
        email = parsedSession.email || null;
        planId = sessionStorage.getItem("selectedPlanId") || null;
        planName = sessionStorage.getItem("selectedPlanName") || null;
      }
    }

    if (!email || !planId || !planName) return;

    setSelectedMenuItem("Extend Your Quota");

    saveSubscription(subscriptionId, planId, planName, email).then((features) => {
      if (features) setUserFeatures(features);
      refreshUser();
    });

    sessionStorage.removeItem("selectedPlanId");
    sessionStorage.removeItem("selectedPlanName");
    if (pathname) {
      router.replace(pathname);
    }
  }, [searchParams, pathname, router, setSelectedMenuItem, user, refreshUser, saveSubscription, selectedPlanId, selectedPlanName, clearPlan]);

  // Sidebar menu items
  const menuItems = useMemo(
    () => [
      { name: "Bulk Search", icon: <FaSearch />, description: "Search in bulk for multiple domains at once." },
      { name: "Keyword Search", icon: <FaGoogle />, description: "Search keywords on Google to analyze rankings." },
      { name: "Competitive Analysis", icon: <TbRadarFilled />, description: "Analyze competitors' domains and backlinks." },
      { name: "Projects", icon: <FaFolderOpen />, description: "Manage and organize your projects here." },
      { name: "Expired Domains", icon: <FaLink />, description: "Find expired domains for backlink opportunities." },
      { name: "Serp Scanner", icon: <FaGauge />, description: "Scan Google SERPs to track keyword rankings." },
    ],
    []
  );

  // Quota usage information
  const quotaUsed = useMemo(
    () => [
      { name: "Backlinks", value: 0, max: user?.features?.backlinks ?? 3 },
      { name: "Plugin", value: 0, max: user?.features?.plugin ?? 3 },
      { name: "Keyword Searches", value: 0, max: user?.features?.keywordSearches ?? 3 },
      { name: "Competitive Analysis", value: 0, max: user?.features?.competitiveAnalysis ?? 1 },
      { name: "SERP Scanner", value: 0, max: user?.features?.SerpScanner ?? 0 },
    ],
    [user]
  );

  // Render selected page content
  const renderContent = useMemo(() => {
    switch (selectedMenuItem) {
      case "Bulk Search":
        return <BulkSearch />;
      case "Keyword Search":
        return <KeywordSearch />;
      case "Competitive Analysis":
        return <CompetitiveAnalysis />;
      case "Projects":
        return <Projects />;
      case "Expired Domains":
        return <ExpiredDomains />;
      case "Serp Scanner":
        return <SerpScanner />;
      case "Extend Your Quota":
        return <PricingTable />;
      case "Account Settings":
        return <AccountSettings />;
      default:
        return <div />;
    }
  }, [selectedMenuItem]);

  return (
    <div className="flex flex-col dark:bg-slate-900">
      <div className="h-fit flex flex-1">
        <Sidebar menuItems={menuItems} quotaUsed={quotaUsed} />
        {renderContent}
      </div>
    </div>
  );
}
