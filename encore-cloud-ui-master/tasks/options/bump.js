module.exports = {
    options: {
        files: ['package.json', 'bower.json'],
        commit: true,
        commitMessage: 'chore(version): v%VERSION% [skip ci]',
        commitFiles: ['package.json', 'bower.json'],
        createTag: false,
        push: false
    }
};