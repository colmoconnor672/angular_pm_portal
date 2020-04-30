import { HttpClient } from '@angular/common/http';
import { ProjectsService } from './projects.service';
import { autoSpy } from '../../../auto-spy';
import { Project } from '../models/project';

describe('ProjectsService', () => {
  it('when getProjectList is called it should', () => {
    // arrange
    const { build } = setup().default();
    const c = build();
    // act
    c.getProjectList().subscribe((list: Project[]) => {
      expect(list).toBeTruthy;
      expect(list.length).toBeGreaterThan(0);
    });
    // assert
    // expect(c).toEqual
  });

  it('when getProjectListForOrganisation is called it should', () => {
    // arrange
    const { build } = setup().default();
    const c = build();
    // act
    c.getProjectListForOrganisation(1);
    // assert
    // expect(c).toEqual
  });

  it('when getProject is called it should', () => {
    // arrange
    const { build } = setup().default();
    const c = build();
    // act
    c.getProject(1);
    // assert
    // expect(c).toEqual
  });

  it('when createProject is called it should', () => {
    // arrange
    const { build } = setup().default();
    const c = build();

    let p: Project = new Project();
    p.name = 'test';
    p.description = 'test';
    p.orgId  = 1;


    // act
    c.createProject(p);
    // assert
    // expect(c).toEqual
  });

  it('when updateProject is called it should', () => {
    // arrange
    const { build } = setup().default();
    const c = build();

    let p: Project = {
      id: 1,
      name: 'test',
      description: 'test',
      orgId: 1
    };

    // act
    c.updateProject(1, p);
    // assert
    // expect(c).toEqual
  });

  it('when deleteProject is called it should', () => {
    // arrange
    const { build } = setup().default();
    const c = build();

    // act
    c.deleteProject(1);
    // assert
    // expect(c).toEqual
  });

  
});

function setup() {
  const http = autoSpy(HttpClient);
  const builder = {
    http,
    default() {
      return builder;
    },
    build() {
      return new ProjectsService(http);
    }
  };

  return builder;
}
