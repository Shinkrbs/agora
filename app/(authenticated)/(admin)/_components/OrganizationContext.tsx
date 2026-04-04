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
  const [currentOrganization, setCurrentOrganizationState] = useState<Organization | null>(() => {
    // Initialize from localStorage on first render
    try {
      const stored = localStorage.getItem("currentOrganization");
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Failed to parse stored organization:", e);
    }
    
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
