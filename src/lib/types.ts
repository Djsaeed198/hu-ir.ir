import type { CaseBundle } from "@/lib/cases";

export type CaseInfoDTO = {
  id: number;
  code: string;
  userId: number;
  serviceId: number | null;
  expertId: number | null;
  serviceTitle: string;
  stage: number;
  progress: number;
  priority: string;
  successScore: number;
  status: string;
  estimatedDays: number;
  createdAt: string;
  updatedAt: string;
};

export type EventDTO = {
  id: number;
  title: string;
  note: string | null;
  stage: number;
  kind: string;
  author: string;
  createdAt: string;
};

export type DocDTO = {
  id: number;
  name: string;
  category: string;
  status: string;
  note: string | null;
  createdAt: string;
};

export type MsgDTO = {
  id: number;
  authorRole: string;
  authorName: string;
  body: string;
  createdAt: string;
};

export type BillDTO = {
  id: number;
  title: string;
  amountEur: number;
  amountToman: number;
  status: string;
  dueDate: string | null;
};

export type CaseBundleDTO = {
  info: CaseInfoDTO;
  applicantName: string;
  applicantEmail: string;
  expertName: string | null;
  events: EventDTO[];
  docs: DocDTO[];
  chat: MsgDTO[];
  bills: BillDTO[];
};

const iso = (value: Date | null): string => (value ? value.toISOString() : "");

export function toBundleDTO(bundle: CaseBundle): CaseBundleDTO {
  return {
    info: {
      id: bundle.info.id,
      code: bundle.info.code,
      userId: bundle.info.userId,
      serviceId: bundle.info.serviceId,
      expertId: bundle.info.expertId,
      serviceTitle: bundle.info.serviceTitle,
      stage: bundle.info.stage,
      progress: bundle.info.progress,
      priority: bundle.info.priority,
      successScore: bundle.info.successScore,
      status: bundle.info.status,
      estimatedDays: bundle.info.estimatedDays,
      createdAt: iso(bundle.info.createdAt),
      updatedAt: iso(bundle.info.updatedAt),
    },
    applicantName: bundle.applicantName,
    applicantEmail: bundle.applicantEmail,
    expertName: bundle.expertName,
    events: bundle.events.map((e) => ({
      id: e.id,
      title: e.title,
      note: e.note,
      stage: e.stage,
      kind: e.kind,
      author: e.author,
      createdAt: iso(e.createdAt),
    })),
    docs: bundle.docs.map((d) => ({
      id: d.id,
      name: d.name,
      category: d.category,
      status: d.status,
      note: d.note,
      createdAt: iso(d.createdAt),
    })),
    chat: bundle.chat.map((m) => ({
      id: m.id,
      authorRole: m.authorRole,
      authorName: m.authorName,
      body: m.body,
      createdAt: iso(m.createdAt),
    })),
    bills: bundle.bills.map((b) => ({
      id: b.id,
      title: b.title,
      amountEur: b.amountEur,
      amountToman: b.amountToman,
      status: b.status,
      dueDate: b.dueDate ? iso(b.dueDate) : null,
    })),
  };
}
