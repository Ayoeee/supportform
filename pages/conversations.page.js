const { expect } = require('@playwright/test')
const path = require('path')
const fs = require('fs')

class ConversationPage {
  constructor(page) {
    this.page = page
    this.respondToClientInputField = page.getByText(
      'Reply to Bamm YommSendAttach'
    )
    this.topicDropdown = page
      .locator('span')
      .filter({ hasText: 'Change topic' })
      .first()
    this.appointmentOption = page.getByRole('menuitem', {
      name: 'Appointments',
    })
    this.attachBtn = page.locator('[data-paste-element="ATTACH_BUTTON"]')
    this.dragAndDropZone = page.locator(
      '[data-paste-element="FILE_UPLOADER_DROPZONE"]'
    ) // Drag-and-drop zone locator
    this.closeModal = page.getByRole('button', { name: 'Close modal' })
    this.sendBtn = page.getByRole('button', { name: 'Send' })
    this.successfulSentMessageTxt = page.getByText('Message sent successfully!')
    this.messageSent = page.getByText('Hello how is your pet doing')
  }

  async initiateConversations(defaultConversationByAssociate) {
    await this.respondToClientInputField.type(defaultConversationByAssociate)
    await this.topicDropdown.click()
    await this.appointmentOption.click()
    await this.sendBtn.click()
  }

  async initiateConversationsWithFileAttachment(
    defaultConversationByAssociate
  ) {
    await this.respondToClientInputField.type(defaultConversationByAssociate)
    await this.topicDropdown.click()
    await this.appointmentOption.click()
    await this.attachBtn.click()
    // Resolve the file path
    const filePath = path.resolve(__dirname, '../files/food.jpeg')

    // Simulate a drag-and-drop event
    const file = {
      name: 'food.jpeg',
      mimeType: 'image/jpeg',
      buffer: fs.readFileSync(filePath), // Read the file content
    }

    await this.page.evaluate(
      ({ dropZoneSelector, file }) => {
        const dataTransfer = new DataTransfer()
        const fileBlob = new Blob([file.buffer], { type: file.mimeType })
        const fileObject = new File([fileBlob], file.name)

        dataTransfer.items.add(fileObject)

        const dropZone = document.querySelector(dropZoneSelector)
        dropZone.dispatchEvent(new DragEvent('dragenter', { dataTransfer }))
        dropZone.dispatchEvent(new DragEvent('dragover', { dataTransfer }))
        dropZone.dispatchEvent(new DragEvent('drop', { dataTransfer }))
      },
      {
        dropZoneSelector: '[data-paste-element="FILE_UPLOADER_DROPZONE"]',
        file,
      }
    )
    await this.closeModal.click()
    await this.sendBtn.click()
  }

  async verifyMessageIsSentSuccessfullyByAssociate() {
    await expect(this.successfulSentMessageTxt).toBeVisible()
    console.log('The message has been successfully sent.')
  }
}

module.exports = ConversationPage
