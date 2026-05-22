// Global variables
let allPublications = [];
let allProjects = [];
let showingSelectedPublications = true;
let showingSelectedProjects = true;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  // Load publications data
  loadPublications();
  
  // Load projects data
  loadProjects();
  
  // Initialize animation delays for sections
  const sections = document.querySelectorAll('section');
  sections.forEach((section, index) => {
    section.style.animationDelay = `${index * 0.1}s`;
  });
  
  // Add event listener for toggle button (publications)
  const toggleButton = document.getElementById('toggle-publications');
  if (toggleButton) {
    toggleButton.addEventListener('click', togglePublications);
  }

  // Add event listener for toggle button (projects)
  const toggleProjectsButton = document.getElementById('toggle-projects');
  if (toggleProjectsButton) {
    toggleProjectsButton.addEventListener('click', toggleProjects);
  }

  // Add toggle buttons for project descriptions
  initProjectToggles();
});

// Load publications from JSON file
function loadPublications() {
  fetch('publications.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("Publications loaded successfully:", data);
      allPublications = data.publications;
      renderPublications(true);
    })
    .catch(error => {
      console.error('Error loading publications:', error);
      // Create fallback publications display if JSON loading fails
      displayFallbackPublications();
    });
}

// Load projects from JSON file
function loadProjects() {
  fetch('projects.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("Projects loaded successfully:", data);
      allProjects = data.projects;
      renderProjects(true);
    })
    .catch(error => {
      console.error('Error loading projects:', error);
    });
}

// Fallback if JSON loading fails
function displayFallbackPublications() {
  const container = document.getElementById('publications-container');
  container.innerHTML = `Error loading publications.`;
}

// Toggle between showing all or selected publications
function togglePublications() {
  showingSelectedPublications = !showingSelectedPublications;
  renderPublications(showingSelectedPublications);
  
  // Update button text
  const toggleButton = document.getElementById('toggle-publications');
  toggleButton.textContent = showingSelectedPublications ? 'Show All' : 'Show Selected';
  const toggleHeader = document.getElementById('toggle-header');
  toggleHeader.textContent = showingSelectedPublications ? 'Selected Publications' : 'All Publications';
}

// Toggle between showing all or selected projects
function toggleProjects() {
  showingSelectedProjects = !showingSelectedProjects;
  renderProjects(showingSelectedProjects);
  
  // Update button text
  const toggleButton = document.getElementById('toggle-projects');
  toggleButton.textContent = showingSelectedProjects ? 'Show All' : 'Show Selected';
  const toggleHeader = document.getElementById('toggle-header-projects');
  toggleHeader.textContent = showingSelectedProjects ? 'Selected Projects' : 'All Projects';
}

// Render publications based on selection state
function renderPublications(selectedOnly) {
  const publicationsContainer = document.getElementById('publications-container');
  publicationsContainer.innerHTML = '';
  
  const pubsToShow = selectedOnly ? 
    allPublications.filter(pub => pub.selected === 1) : 
    allPublications;
  
  pubsToShow.forEach(publication => {
    const pubElement = createPublicationElement(publication);
    publicationsContainer.appendChild(pubElement);
  });
}

// Render projects based on selection state
function renderProjects(selectedOnly) {
  const projectsContainer = document.getElementById('projects-container');
  projectsContainer.innerHTML = '';
  
  const projectsToShow = selectedOnly ? 
    allProjects.filter(project => project.selected === 1) : 
    allProjects;
  
  projectsToShow.forEach(project => {
    const projectElement = createProjectElement(project);
    projectsContainer.appendChild(projectElement);
  });
  
  // Re-initialize project toggles after rendering
  initProjectToggles();
}

// Create HTML element for a publication
function createPublicationElement(publication) {
  const pubItem = document.createElement('div');
  pubItem.className = 'publication-item';
  
  // Create thumbnail
  const thumbnail = document.createElement('div');
  thumbnail.className = 'pub-thumbnail';
  thumbnail.onclick = () => openModal(publication.thumbnail);
  
  const thumbnailImg = document.createElement('img');
  thumbnailImg.src = publication.thumbnail;
  thumbnailImg.alt = `${publication.title} thumbnail`;
  thumbnail.appendChild(thumbnailImg);
  
  // Create content container
  const content = document.createElement('div');
  content.className = 'pub-content';
  
  // Add title
  const title = document.createElement('div');
  title.className = 'pub-title';
  title.textContent = publication.title;
  content.appendChild(title);
  
  // Add authors with highlight
  const authors = document.createElement('div');
  authors.className = 'pub-authors';
  
  // Format authors with highlighting
  let authorsHTML = '';
  publication.authors.forEach((author, index) => {
    if (author.includes('Author 3')) { // TODO: Highlight specific author
      authorsHTML += `<span class="highlight-name">${author}</span>`;
    } else {
      authorsHTML += author;
    }
    
    if (index < publication.authors.length - 1) {
      authorsHTML += ', ';
    }
  });
  
  authors.innerHTML = authorsHTML;
  content.appendChild(authors);
  
  // Add venue with award if present
  const venueContainer = document.createElement('div');
  venueContainer.className = 'pub-venue-container';
  
  const venue = document.createElement('div');
  venue.className = 'pub-venue';
  venue.textContent = publication.venue;
  venueContainer.appendChild(venue);
  
  // Add award if it exists
  if (publication.award && publication.award.length > 0) {
    const award = document.createElement('div');
    award.className = 'pub-award';
    award.textContent = publication.award;
    venueContainer.appendChild(award);
  }
  
  content.appendChild(venueContainer);
  
  // Add links if they exist
  if (publication.links) {
    const links = document.createElement('div');
    links.className = 'pub-links';
    
    if (publication.links.pdf) {
      const pdfLink = document.createElement('a');
      pdfLink.href = publication.links.pdf;
      pdfLink.textContent = '[PDF]';
      links.appendChild(pdfLink);
    }
    
    if (publication.links.slide) {
      const slideLink = document.createElement('a');
      slideLink.href = publication.links.slide;
      slideLink.textContent = '[Slides]';
      links.appendChild(slideLink);
    }

    if (publication.links.video) {
      const videoLink = document.createElement('a');
      videoLink.href = publication.links.video;
      videoLink.textContent = '[Video]';
      links.appendChild(videoLink);
    }

    if (publication.links.github) {
      const codeLink = document.createElement('a');
      codeLink.href = publication.links.github;
      codeLink.textContent = '[GitHub]';
      links.appendChild(codeLink);
    }

    if (publication.links.project) {
      const projectLink = document.createElement('a');
      projectLink.href = publication.links.project;
      projectLink.textContent = '[Project Page]';
      links.appendChild(projectLink);
    }
    
    content.appendChild(links);
  }
  
  // Assemble the publication item
  pubItem.appendChild(thumbnail);
  pubItem.appendChild(content);
  
  return pubItem;
}

// Create HTML element for a project
function createProjectElement(project) {
  const projectCard = document.createElement('article');
  projectCard.className = 'project-card';
  
  // Create project logo
  const projectLogo = document.createElement('div');
  projectLogo.className = 'project-logo';
  
  const logoImg = document.createElement('img');
  logoImg.src = project.logo;
  logoImg.alt = `${project.shortTitle} logo`;
  projectLogo.appendChild(logoImg);
  
  // Create project content
  const projectContent = document.createElement('div');
  projectContent.className = 'project-content';
  
  // Add title
  const projectTitle = document.createElement('h3');
  projectTitle.className = 'project-title';
  projectTitle.textContent = project.title;
  projectContent.appendChild(projectTitle);
  
  // Create project meta
  const projectMeta = document.createElement('div');
  projectMeta.className = 'project-meta';
  
  // Funded by
  const fundedSpan = document.createElement('span');
  if (project.meta.fundedBy.url) {
    fundedSpan.innerHTML = `<strong>Funded by:</strong> <a href="${project.meta.fundedBy.url}" target="_blank">${project.meta.fundedBy.name}</a>`;
  } else {
    fundedSpan.innerHTML = `<strong>Funded by:</strong> ${project.meta.fundedBy.name}`;
  }
  projectMeta.appendChild(fundedSpan);
  
  // Duration (if exists)
  if (project.meta.duration) {
    const durationSpan = document.createElement('span');
    durationSpan.innerHTML = `<strong>Duration:</strong> ${project.meta.duration}`;
    projectMeta.appendChild(durationSpan);
  }
  
  // Status
  const statusSpan = document.createElement('span');
  statusSpan.innerHTML = `<strong>Status:</strong> ${project.meta.status}`;
  projectMeta.appendChild(statusSpan);
  
  // Role
  const roleSpan = document.createElement('span');
  roleSpan.innerHTML = `<strong>Role:</strong> ${project.meta.role}`;
  projectMeta.appendChild(roleSpan);
  
  // Website (if exists)
  if (project.meta.website) {
    const websiteSpan = document.createElement('span');
    websiteSpan.innerHTML = `<strong>Website:</strong> <a href="${project.meta.website.url}" target="_blank">${project.meta.website.name}</a>`;
    projectMeta.appendChild(websiteSpan);
  }
  
  projectContent.appendChild(projectMeta);
  
  // Add description
  const projectDescription = document.createElement('p');
  projectDescription.className = 'project-description';
  projectDescription.textContent = project.description;
  projectContent.appendChild(projectDescription);
  
  // Assemble the project card
  projectCard.appendChild(projectLogo);
  projectCard.appendChild(projectContent);
  
  return projectCard;
}

function initProjectToggles() {
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    const description = card.querySelector('.project-description');
    if (!description) return;

    const toggleButton = document.createElement('button');
    toggleButton.type = 'button';
    toggleButton.className = 'project-toggle';
    toggleButton.setAttribute('aria-expanded', 'false');
    toggleButton.textContent = '+ Show description';

    toggleButton.addEventListener('click', () => {
      const isOpen = card.classList.toggle('open');
      toggleButton.textContent = isOpen ? '− Hide description' : '+ Show description';
      toggleButton.setAttribute('aria-expanded', String(isOpen));
    });

    const meta = card.querySelector('.project-meta');
    if (meta) {
      card.querySelector('.project-content').insertBefore(toggleButton, meta);
    } else {
      card.querySelector('.project-content').appendChild(toggleButton);
    }
  });
}

// Modal functionality for viewing original images
function openModal(imageSrc) {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  modal.style.display = "block";
  setTimeout(() => {
    modal.classList.add('show');
  }, 10);
  modalImg.src = imageSrc;
}

function closeModal() {
  const modal = document.getElementById('imageModal');
  modal.classList.remove('show');
  setTimeout(() => {
    modal.style.display = "none";
  }, 300);
}

// Close modal when clicking outside the image
window.onclick = function(event) {
  const modal = document.getElementById('imageModal');
  if (event.target == modal) {
    closeModal();
  }
}
