module.exports = {
  projects: [
    '<rootDir>/services/users',
    '<rootDir>/services/orders'
  ],
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest'
  }
}; 