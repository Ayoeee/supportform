exports.commonQuestionsLocators = {
  commonQuestionsLink: (page) =>
    page.getByRole('main').getByText('Common Questions'),
  whoIsKinshipParagraph: (page) => page.getByText('Who is Kinship?'),
  doLinnauesClientPayParagraph: (page) =>
    page.getByText('Do Linnaeus clients pay for'),
  whatCanLinnauesClientsDoParagraph: (page) =>
    page.getByText('What can Linnaeus clients do'),
  howDoesPracticeReceiveMessageParagraph: (page) =>
    page.getByText('How does the practice send'),
  willIhaveAccessToParagraph: (page) =>
    page.getByText('Will I have full access to'),
  howIsThePracticeNotifiedParagraph: (page) =>
    page.getByText('How is the practice notified'),
  howDoesThePracticeNowParagraph: (page) =>
    page.getByText('How does the practice know'),
  canIuseTheCommunicationToolParagraph: (page) =>
    page.getByText('Can I use the communication'),
  howDoesAClientMessageParagraph: (page) =>
    page.getByText('How does a client message'),
  howCanIGetSupportParagraph: (page) =>
    page.getByText('How can I get support and/or'),
}
