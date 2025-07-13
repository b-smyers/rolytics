const usersService = require('@services/users.services').default;
const experiencesService = require('@services/experiences.services').default;

describe('Experiences Service', () => {
    const username = 'John';
    const email = 'john.coltrane@mail.com';
    const password = 'bigsteps';
    let userId;
    beforeAll(() => {
        // Create a user
        userId = usersService.createUser(username, email, password).id;
    });

    afterAll(() => {
        // Delete user, cascade all
        usersService.deleteUser(userId); 
    });

    describe('createExperience', () => {
        let experienceId;
        afterAll(() => {
            // Delete the experience
            experiencesService.deleteExperience(experienceId);
        });

        it('should create an experience and return its id', () => {
            const robloxExperienceId = '8731-1b3e';
            const name = 'My Experience';
            const description = 'My super short and sweet description';
            const pageLink = 'www.page.link.com';
            const thumbnailLink = 'www.thumbnail.link.png';
    
            experienceId = experiencesService.createExperience(
                robloxExperienceId,
                userId,
                name,
                description,
                pageLink,
                thumbnailLink
            );
            expect(experienceId).toBe(1);

            const experience = experiencesService.getExperienceById(experienceId);
            expect(experience).toHaveProperty('roblox_experience_id');
            expect(experience.roblox_experience_id).toBe(robloxExperienceId);
            expect(experience).toHaveProperty('user_id');
            expect(experience.user_id).toBe(userId);
            expect(experience).toHaveProperty('name');
            expect(experience.name).toBe(name);     
            expect(experience).toHaveProperty('description');
            expect(experience.description).toBe(description);
            expect(experience).toHaveProperty('page_link');
            expect(experience.page_link).toBe(pageLink);
            expect(experience).toHaveProperty('thumbnail_link');
            expect(experience.thumbnail_link).toBe(thumbnailLink);
        });
    });

    describe('deleteExperience', () => {
        let experienceId;
        beforeAll(() => {
            // Create the experience to test
            const robloxExperienceId = 'bd41-e8c1';
            const name = 'Bad Experience, Delete Me';
            const description = 'You should probably delete this experience';
            const pageLink = 'www.page.link.com';
            const thumbnailLink = 'www.thumbnail.link.png';
    
            experienceId = experiencesService.createExperience(
                robloxExperienceId,
                userId,
                name,
                description,
                pageLink,
                thumbnailLink
            );
        });

        it('should delete the experience and return true', () => {
            const result = experiencesService.deleteExperience(experienceId);

            expect(result).toBe(true);
        });

        it('should return false if no experience exists', () => {
            const result = experiencesService.deleteExperience(experienceId);

            expect(result).toBe(false);
        });
    });

    describe('updateExperience', () => {
        let experienceId;
        beforeAll(() => {
            // Create the experience to test
            const robloxExperienceId = 'faaa-aaaf';
            const name = 'I need a new name';
            const description = 'My description is wrong';
            const pageLink = 'www.bad.page.link.com';
            const thumbnailLink = 'www.bad.thumbnail.link.png';
    
            experienceId = experiencesService.createExperience(
                robloxExperienceId,
                userId,
                name,
                description,
                pageLink,
                thumbnailLink
            );
        });

        afterAll(() => {
            // Delete the place
            experiencesService.deleteExperience(experienceId);
        });

        it('should update the name', () => {
            const name = 'Epic Name';
            experiencesService.updateExperience(experienceId, { name });

            const experience = experiencesService.getExperienceById(experienceId);
            expect(experience.name).toBe(name);
        });

        it('should update the description', () => {
            const description = 'Super awesome description for my game I made';
            experiencesService.updateExperience(experienceId, { description });

            const experience = experiencesService.getExperienceById(experienceId);
            expect(experience.description).toBe(description);
        });

        it('should update the page link', () => {
            const page_link = 'www.epic.page.link.com';
            experiencesService.updateExperience(experienceId, { page_link });

            const experience = experiencesService.getExperienceById(experienceId);
            expect(experience.page_link).toBe(page_link);
        });

        it('should update the thumbnail link', () => {
            const thumbnail_link = 'www.mynewthumbnail.png';
            experiencesService.updateExperience(experienceId, { thumbnail_link });

            const experience = experiencesService.getExperienceById(experienceId);
            expect(experience.thumbnail_link).toBe(thumbnail_link);
        });
    });
});