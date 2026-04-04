"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { Organization } from "@/types/database";

interface OrganizationContextType {
  currentOrganization: Organization | null;
  setCurrentOrganization: (org: Organization | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

interface OrganizationProviderProps {
  children: React.ReactNode;
  initialOrganizations?: Organization[];
}

export function OrganizationProvider({ 
  children, 
  initialOrganizations = [] 
}: OrganizationProviderProps) {
  // Initialize with first approved organization from props (server state)
  const [currentOrganization, setCurrentOrganizationState] = useState<Organization | null>(() => {
    // Fall back to first approved organization from initial list
    if (initialOrganizations.length > 0) {
      const approvedOrg = initialOrganizations.find(org => org.approval_status === "approved");
      if (approvedOrg) {
        return approvedOrg;
      }
    }
    
    return null;
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage after client mount to avoid hydration mismatch
  useEffect(() => {
    try {
      const stored = localStorage.getItem("currentOrganization");
      if (stored) {
        const storedOrg = JSON.parse(stored);
        // Only restore if it's in the approved organizations list
        const isApproved = initialOrganizations.some(org => org.id === storedOrg.id && org.approval_status === "approved");
        if (isApproved) {
          setCurrentOrganizationState(storedOrg);
        }
      }
    } catch (e) {
      console.error("Failed to parse stored organization:", e);
    }
    setIsHydrated(true);
  }, [initialOrganizations]);

  const setCurrentOrganization = useCallback((org: Organization | null) => {
    setCurrentOrganizationState(org);
    if (org) {
      localStorage.setItem("currentOrganization", JSON.stringify(org));
    } else {
      localStorage.removeItem("currentOrganization");
    }
  }, []);

  return (
    <OrganizationContext.Provider
      value={{
        currentOrganization,
        setCurrentOrganization,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization() {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error("useOrganization must be used within OrganizationProvider");
  }
  return context;
}
