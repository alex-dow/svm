import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ProjectWithCounts } from "@/lib/db/schemas/projects";
import ProjectsList from "./ProjectsList";

// Mock the actions
vi.mock("@/lib/actions/projects", () => ({
  getProjectsAction: vi.fn()
}));

const mockPush = vi.fn();

const mockProjects: ProjectWithCounts[] = [{
  id: 1,
  name: "Project 1",
  owner_id: "user-123",
  trains: 10,
  train_stations: 5,
}, {
  id: 2,
  name: "Project 2",
  owner_id: "user-123",
  trains: 20,
  train_stations: 10,
}];

describe("ProjectsList", () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Renders projects list", () => {

    vi.mock('next/navigation', () => ({
      useRouter: vi.fn(),
      usePathname: vi.fn(),
      useSearchParams: vi.fn(),
    }));

    render(<ProjectsList projects={mockProjects} />);

    const project1card = document.getElementById(`project-card-${mockProjects[0].id}`) as HTMLDivElement;
    const project2card = document.getElementById(`project-card-${mockProjects[1].id}`) as HTMLDivElement;

    expect(project1card).toBeInTheDocument();
    expect(project2card).toBeInTheDocument();

    const totalTrains1 = document.querySelector(`#total-trains-${mockProjects[0].id} [data-test-id="value"]`) as HTMLElement;
    const totalTrainStations1 = document.querySelector(`#total-train-stations-${mockProjects[0].id} [data-test-id="value"]`) as HTMLElement;
    expect(totalTrains1).toBeInTheDocument();
    expect(totalTrainStations1).toBeInTheDocument();
    expect(totalTrains1.textContent).toBe(mockProjects[0].trains.toString());
    expect(totalTrainStations1.textContent).toBe(mockProjects[0].train_stations.toString());
    
    const totalTrains2 = document.querySelector(`#total-trains-${mockProjects[1].id} [data-test-id="value"]`) as HTMLElement;
    const totalTrainStations2 = document.querySelector(`#total-train-stations-${mockProjects[1].id} [data-test-id="value"]`) as HTMLElement;
    expect(totalTrains2).toBeInTheDocument();
    expect(totalTrainStations2).toBeInTheDocument();
    expect(totalTrains2.textContent).toBe(mockProjects[1].trains.toString());
    expect(totalTrainStations2.textContent).toBe(mockProjects[1].train_stations.toString());

  });

  it('Redirects to project page when project card open button is clicked', async () => {

    const user = userEvent.setup();

    vi.mock('next/navigation', () => ({
      useRouter: () => ({
        push: mockPush
      }),
      usePathname: vi.fn(),
      useSearchParams: vi.fn(),
    }));
  

    render(<ProjectsList projects={mockProjects} />);

    const openButton = document.querySelector(`#project-card-${mockProjects[0].id} [data-test-id="open-project-button"]`) as HTMLButtonElement;
    expect(openButton).toBeInTheDocument();

    await user.click(openButton);

    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith(`/projects/${mockProjects[0].id}`);    
  });
});