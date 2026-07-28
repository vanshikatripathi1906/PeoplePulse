import React, { useState } from "react";
import { Search, CheckCircle2, UserCheck, Star } from "lucide-react";
import { Card } from "../common/Card";
import { SectionTitle } from "../common/SectionTitle";
import { DEPT_COLORS } from "../common/EmployeeBadge";

export function AIResumeSearchModule({ employees }) {
  const [query, setQuery] = useState("React, Node.js, MongoDB");
  const [minRating, setMinRating] = useState(3);
  const [assignedMessage, setAssignedMessage] = useState(null);

  const searchTags = query
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  const matches = (employees || [])
    .map((emp) => {
      let matchedSkillCount = 0;
      let highestRating = 0;

      const empSkills = emp.skills || [];
      const empText = `${emp.name} ${emp.designation} ${emp.department}`.toLowerCase();

      searchTags.forEach((tag) => {
        const foundSkill = empSkills.find(
          (sk) => sk.name.toLowerCase().includes(tag) || tag.includes(sk.name.toLowerCase())
        );

        if (foundSkill && foundSkill.level >= minRating) {
          matchedSkillCount++;
          if (foundSkill.level > highestRating) highestRating = foundSkill.level;
        } else if (empText.includes(tag)) {
          matchedSkillCount++;
          if (highestRating === 0) highestRating = 3;
        }
      });

      if (searchTags.length === 0 || matchedSkillCount === 0) {
        return null;
      }

      const matchRatio = matchedSkillCount / searchTags.length;
      const matchPercentage = Math.min(100, Math.round(matchRatio * 100) + highestRating * 4);

      return {
        emp,
        matchPercentage,
        matchedSkillCount,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.matchPercentage - a.matchPercentage);

  const handleAssign = (empName) => {
    setAssignedMessage(`Successfully assigned ${empName} to project! Notification sent.`);
    setTimeout(() => setAssignedMessage(null), 3500);
  };

  return (
    <>
      <SectionTitle
        title="Skill Search"
      />

      {assignedMessage && (
        <div style={{ background: "#2F8F8222", border: "1px solid #2F8F82", padding: "10px 16px", borderRadius: 10, color: "#2F8F82", fontSize: 13, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <CheckCircle2 size={16} /> {assignedMessage}
        </div>
      )}

      <Card style={{ marginBottom: 24, padding: "24px 28px" }}>
        <h3 className="nf-h3" style={{ fontSize: 18, marginBottom: 4 }}>Search Candidates &amp; Workforce by Skills</h3>
        <div style={{ fontSize: 13, color: "var(--ink-dim)", marginBottom: 18 }}>
          Filter employees by typing required technical or core skills (e.g. React, Node.js, Python, SQL) and selecting minimum star proficiency.
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2.2fr 1fr", gap: 20, alignItems: "flex-end" }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)" }}>
              Skill Query (comma separated)
            </label>
            <div className="nf-search" style={{ marginTop: 6, padding: "10px 16px", background: "var(--surface-alt)", borderRadius: 12, border: "1px solid var(--border)" }}>
              <Search size={16} style={{ color: "var(--ink-dim)" }} />
              <input
                style={{ width: "100%", fontSize: 14, background: "transparent", border: "none", color: "var(--ink)", outline: "none" }}
                placeholder="e.g. React, Node.js, Python, SQL, Figma, AWS..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)" }}>
              Minimum Skill Rating (Stars)
            </label>
            <select
              className="nf-select"
              style={{ marginTop: 6, width: "100%", padding: "11px 14px", fontSize: 13.5 }}
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
            >
              <option value={1}>★☆☆☆☆ (1+ Stars - Basic)</option>
              <option value={2}>★★☆☆☆ (2+ Stars - Intermediate)</option>
              <option value={3}>★★★☆☆ (3+ Stars - Proficient)</option>
              <option value={4}>★★★★☆ (4+ Stars - Advanced)</option>
              <option value={5}>★★★★★ (5 Stars - Expert)</option>
            </select>
          </div>
        </div>
      </Card>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 className="nf-h3" style={{ margin: 0, fontSize: 16.5 }}>
          Top Skill Match Candidates ({matches.length})
        </h3>
      </div>

      <div className="nf-grid-2" style={{ gap: 20 }}>
        {matches.map(({ emp, matchPercentage }) => {
          const color = DEPT_COLORS[emp.department] || "#2F8F82";
          return (
            <Card key={emp.id || emp.empId} style={{ padding: 22 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div className="nf-avatar" style={{ background: `${color}26`, color, width: 44, height: 44, fontSize: 16 }}>
                    {emp.initials}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{emp.name}</div>
                    <div style={{ fontSize: 12.5, color: "var(--ink-dim)" }}>
                      {emp.designation} · {emp.department}
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700, fontFamily: "'Inter', sans-serif", color: "var(--ink-dim)", marginTop: 2 }}>
                      {emp.empId}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    background: matchPercentage >= 80 ? "#2F8F8220" : "#E8A33D20",
                    color: matchPercentage >= 80 ? "#2F8F82" : "#E8A33D",
                    fontWeight: 700,
                    fontSize: 12,
                    padding: "4px 10px",
                    borderRadius: 20,
                    border: `1px solid ${matchPercentage >= 80 ? "#2F8F8244" : "#E8A33D44"}`,
                  }}
                >
                  {matchPercentage}% MATCH
                </div>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                {(emp.skills || []).map((sk) => (
                  <span
                    key={sk.name}
                    style={{
                      background: "var(--surface-alt)",
                      border: "1px solid var(--border)",
                      borderRadius: 6,
                      padding: "3px 8px",
                      fontSize: 11.5,
                      color: "var(--ink)",
                    }}
                  >
                    {sk.name} {"★".repeat(sk.level)}
                  </span>
                ))}
              </div>

              <button
                className="nf-btn primary sm"
                style={{ width: "100%", justifyContent: "center", padding: "8px 14px" }}
                onClick={() => handleAssign(emp.name)}
              >
                <UserCheck size={14} /> Assign to Project
              </button>
            </Card>
          );
        })}
      </div>

      {matches.length === 0 && (
        <div className="nf-empty" style={{ marginTop: 30 }}>
          No employees match the skill query "{query}" with minimum {minRating}+ star rating.
        </div>
      )}
    </>
  );
}
