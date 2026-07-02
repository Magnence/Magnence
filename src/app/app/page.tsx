"use client";

import * as React from "react";
import { useAppStore } from "@/lib/store";
import { AppShell } from "@/components/app-shell";
import { AuthPage } from "@/components/auth-page";
import { DashboardModule } from "@/components/modules/dashboard";
import { SupportModule } from "@/components/modules/support";
import { UnifiedAIModule } from "@/components/modules/unified-ai";
import { PeopleModule } from "@/components/modules/people";
import { SettingsModule } from "@/components/modules/settings";
import { CalendarModule } from "@/components/modules/calendar";
import { DocumentsModule } from "@/components/modules/documents";
import { SearchModule } from "@/components/modules/search";
// Phase 2 modules
import { TasksModule } from "@/components/modules/tasks";
import { ProjectsModule } from "@/components/modules/projects";
import { TimeModule } from "@/components/modules/time";
import { AdminModule } from "@/components/modules/admin";
// Phase 3 modules
import { CrmModule } from "@/components/modules/crm";
import { LeadsModule } from "@/components/modules/leads";
import { ClientsModule } from "@/components/modules/clients";
import { ContractsModule } from "@/components/modules/contracts";
import { FinanceModule } from "@/components/modules/finance";
// Phase 4 modules
// Phase 5 modules
// Phase 6 modules
import { RbacMatrixModule } from "@/components/modules/rbac-matrix";
import { CMSBlogModule } from "@/components/modules/cms-blog";
import { CMSCaseStudiesModule } from "@/components/modules/cms-case-studies";
// Continuous Improvement modules

export default function Home() {
  const { user, activeModule, currentContext, setCurrentContext } = useAppStore();

  React.useEffect(() => {
    if (user && activeModule !== currentContext.module) {
      setCurrentContext({ module: activeModule });
    }
  }, [activeModule, user, currentContext.module, setCurrentContext]);

  if (!user) {
    return <AuthPage />;
  }

  return (
    <>
      <AppShell>
        {/* Workspace */}
        {activeModule === "dashboard" && <DashboardModule />}
        {activeModule === "ai-center" && <UnifiedAIModule />}
        {activeModule === "search" && <SearchModule />}
        {/* Work */}
        {activeModule === "tasks" && <TasksModule />}
        {activeModule === "projects" && <ProjectsModule />}
        {activeModule === "time" && <TimeModule />}
        {/* HR */}
        {/* Company */}
        {activeModule === "calendar" && <CalendarModule />}
        {activeModule === "people" && <PeopleModule />}
        {/* Resources */}
        {/* Resources — knowledge & ai-brain merged into ai-center */}
        {activeModule === "documents" && <DocumentsModule />}
        {activeModule === "support" && <SupportModule />}
        {/* Departments */}
        {/* Business */}
        {activeModule === "crm" && <CrmModule />}
        {activeModule === "leads" && <LeadsModule />}
        {activeModule === "clients" && <ClientsModule />}
        {activeModule === "contracts" && <ContractsModule />}
        {activeModule === "finance" && <FinanceModule />}
        {/* Operations */}
        {/* Phase 4 — Marketing & Sales Operations */}
        {/* Phase 5 — Platform Intelligence & Integrations */}
        {/* Phase 6 — AI Intelligence & Enterprise Management */}
        {/* AI Intelligence — ai-brain merged into ai-center */}
        {activeModule === "rbac-matrix" && <RbacMatrixModule />}
        {/* Admin */}
        {activeModule === "admin" && <AdminModule />}
        {activeModule === "settings" && <SettingsModule />}
        {activeModule === "cms-blog" && <CMSBlogModule />}
        {activeModule === "cms-case-studies" && <CMSCaseStudiesModule />}
        {/* Continuous Improvement */}
      </AppShell>
    </>
  );
}
