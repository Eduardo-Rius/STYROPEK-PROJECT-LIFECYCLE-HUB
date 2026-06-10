// scripts/validateSprint3.js
// Validation script for Sprint 3 – runs without browser automation.
// Uses ES‑module imports because the project’s package.json sets "type": "module".

import { db } from "../src/services/firebase.js"; // Firestore instance
import { collection, addDoc, setDoc, doc, getDoc, query, where, getDocs, orderBy, limit } from "firebase/firestore";

(async () => {
  try {
    // Helper to log PASS/FAIL
    const log = (msg, pass) => {
      const status = pass ? "PASS" : "FAIL";
      console.log(`${msg}: ${status}`);
    };

    // 1. Create test project
    const projectData = {
      projectName: "Proyecto Prueba Sprint 3",
      status: "Draft",
      currentStage: "Investment Request",
      projectLeaderId: "demoUser123", // placeholder – should exist in Auth
      estimatedBudgetUSD: 100000,
      areaId: "demoArea",
      plantId: "demoPlant",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const projectRef = await addDoc(collection(db, "projects"), projectData);
    const projectId = projectRef.id;
    log("Create Project document", true);

    // 2. Create PROJECT_CREATED audit log
    const projectAudit = {
      action: "PROJECT_CREATED",
      module: "PROJECT",
      projectId,
      userId: projectData.projectLeaderId,
      timestamp: new Date(),
      newValue: { ...projectData }
    };
    await addDoc(collection(db, "auditLogs"), projectAudit);
    log("Create PROJECT_CREATED audit log", true);

    // 3. Create Investment Request in top‑level collection
    const investmentRequestData = {
      projectId,
      background: "Demo background",
      scopeDescription: "Demo scope",
      objectives: "Demo objectives",
      expectedBenefits: "Demo benefits",
      estimatedSavingsUSD: 5000,
      timeReductionHours: 100,
      involvesFixedAssetReplacement: false,
      status: "Submitted",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const invReqRef = await addDoc(collection(db, "investmentRequests"), investmentRequestData);
    const invReqId = invReqRef.id;
    log("Create Investment Request document", true);

    // 4. Create INVESTMENT_REQUEST_CREATED audit log
    const invReqAudit = {
      action: "INVESTMENT_REQUEST_CREATED",
      module: "INVESTMENT_REQUEST",
      projectId,
      userId: projectData.projectLeaderId,
      timestamp: new Date(),
      newValue: { ...investmentRequestData }
    };
    await addDoc(collection(db, "auditLogs"), invReqAudit);
    log("Create INVESTMENT_REQUEST_CREATED audit log", true);

    // 5. Create ADP in top‑level collection
    const adpData = {
      projectId,
      projectBackground: "Demo project background",
      projectObjective: "Demo objective",
      deliverableScope: "Demo scope",
      criticalVariables: "Demo variables",
      assumptions: "Demo assumptions",
      exclusions: "Demo exclusions",
      estimatedDurationMonths: 12,
      status: "Draft",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const adpRef = await addDoc(collection(db, "adps"), adpData);
    const adpId = adpRef.id;
    log("Create ADP document", true);

    // 6. Create ADP_CREATED audit log
    const adpAudit = {
      action: "ADP_CREATED",
      module: "ADP",
      projectId,
      userId: projectData.projectLeaderId,
      timestamp: new Date(),
      newValue: { ...adpData }
    };
    await addDoc(collection(db, "auditLogs"), adpAudit);
    log("Create ADP_CREATED audit log", true);

    // 7. Update project stage to ADP
    await setDoc(doc(db, "projects", projectId), { currentStage: "ADP" }, { merge: true });
    log("Update project currentStage to ADP", true);

    // 8. Create PROJECT_STAGE_UPDATED audit log
    const stageAudit = {
      action: "PROJECT_STAGE_UPDATED",
      module: "PROJECT",
      projectId,
      userId: projectData.projectLeaderId,
      timestamp: new Date(),
      newValue: { currentStage: "ADP" }
    };
    await addDoc(collection(db, "auditLogs"), stageAudit);
    log("Create PROJECT_STAGE_UPDATED audit log", true);

    // 9. Verification queries
    const projSnap = await getDoc(doc(db, "projects", projectId));
    log("Project exists", projSnap.exists());

    const invSnap = await getDoc(doc(db, "investmentRequests", invReqId));
    const invReqOk = invSnap.exists() && invSnap.data().projectId === projectId;
    log("Investment Request exists with correct projectId", invReqOk);

    const adpSnap = await getDoc(doc(db, "adps", adpId));
    const adpOk = adpSnap.exists() && adpSnap.data().projectId === projectId;
    log("ADP exists with correct projectId", adpOk);

    const projAfterSnap = await getDoc(doc(db, "projects", projectId));
    const stageOk = projAfterSnap.exists() && projAfterSnap.data().currentStage === "ADP";
    log("Project currentStage is ADP", stageOk);

    // Verify audit logs (latest 20)
    const auditQuery = query(
      collection(db, "auditLogs"),
      where("projectId", "==", projectId),
      orderBy("timestamp", "desc"),
      limit(20)
    );
    const auditSnap = await getDocs(auditQuery);
    const actions = auditSnap.docs.map(d => d.data().action);
    const auditChecks = [
      { action: "PROJECT_CREATED", name: "PROJECT_CREATED audit" },
      { action: "INVESTMENT_REQUEST_CREATED", name: "INVESTMENT_REQUEST_CREATED audit" },
      { action: "ADP_CREATED", name: "ADP_CREATED audit" },
      { action: "PROJECT_STAGE_UPDATED", name: "PROJECT_STAGE_UPDATED audit" }
    ];
    auditChecks.forEach(c => log(`Audit log ${c.name}`, actions.includes(c.action)));

    console.log("\n--- IDs ---");
    console.log(`Project ID: ${projectId}`);
    console.log(`Investment Request ID: ${invReqId}`);
    console.log(`ADP ID: ${adpId}`);
  } catch (e) {
    console.error("Validation script error:", e);
    process.exit(1);
  }
})();
