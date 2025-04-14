exports.trainingResourcesLocators = {
  trainingResourcesLink: (page) =>
    page.getByRole('link', { name: 'Training Resources' }),
  trainingVideosTab: (page) => page.getByText('Here, you can access quick'),
  trainingDocumentsTab: (page) =>
    page.getByRole('tab', { name: 'Training Documents' }),
}
