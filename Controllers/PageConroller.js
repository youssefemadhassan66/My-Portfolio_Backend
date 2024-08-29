const fs = require('fs');
const path = require('path');
const express = require('express');
const Content = require('../models/ContentModel');
const Section = require('../models/SectionModel');
const Page = require('../models/PageModel');
exports.getPage = async (req, res) => {
  const { pageName } = req.params;

  try {
      const page = await Page.findOne({ name: pageName })
          .populate({
              path: 'Sections',
              populate: {
                  path: 'Contents',
                  model: 'Content'
              }
          });

      if (!page) {
          return res.status(404).json({ msg: 'Page not found' });
      }

      const imageFieldMapping = {
            'homeAbout': 'homeAboutImage',
            'homeServices': 'homeServicesImage',
            'homeBrief': 'homeBriefImage',
            'aboutGoals':'AboutGoalsImage',
            'aboutIntroduction':'AboutIntroductionImage',
      };

      for (let section of page.Sections) {
          for (let content of section.Contents) {

              const imageFieldName = imageFieldMapping[content.title];

              if (imageFieldName && content.data[imageFieldName]) {
                    
                  const imageBuffer = content.data[imageFieldName].buffer;
                  const imageContentType = content.data[imageFieldName].contentType;

                  content.data[imageFieldName] = {
                      image: `data:${imageContentType};base64,${imageBuffer.toString('base64')}`
                  };
              }
              if (content.title === 'homeBlogs') {
                  content.data.homeBlogs = content.data.homeBlogs.map(blog => {
                      if (blog.homeBlogImage) {
                          const blogImageBuffer = blog.homeBlogImage.buffer;
                          const blogImageContentType = blog.homeBlogImage.contentType;

                          blog.homeBlogImage = {
                              image: `data:${blogImageContentType};base64,${blogImageBuffer.toString('base64')}`
                          };
                      }
                      return blog;
                  });
              }
          }
      }

      res.json(page.Sections);
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
  }
};



// Update page

exports.updatePage = async (req, res) => {
  let { requestData } = req.body;
  const { pageName } = req.params;
  try {
    requestData = JSON.parse(requestData);
    const { sections } = requestData;
    
    let page = await Page.findOne({ name: pageName });
    if (!page) {
      page = new Page({ name: pageName, Sections: [] });
    }

    for (const sectionData of sections) {
      let section = await Section.findOne({ title: sectionData.title });
      if (!section) {
        section = new Section({ title: sectionData.title, Contents: [] });
        page.Sections.push(section._id);
      }

      for (const contentData of sectionData.Contents) {
        let content = await Content.findOne({ title: contentData.title});

        if (!content) {
          content = new Content({
            title: contentData.title,
            type: contentData.type,
            data: contentData.data
          });
          await content.save();
        } else {
          
            if (contentData.title == 'homeBlogs') {
              let homeBlogs = contentData.data.homeBlogs;
              homeBlogs.forEach((blog, index) => {
                const BlogImage = 'homeBlogImage_' + index;
                const matchingImageFile = req.files.find(file => file.fieldname === BlogImage);

                if (matchingImageFile) {
                  blog.homeBlogImage = {
                    buffer: matchingImageFile.buffer,
                    contentType: matchingImageFile.mimetype
                  };
                }
              });
            }else if(contentData.title == 'showCasesSections'){
              let ShowcasesSections = contentData.data.ShowcasesSections;
              ShowcasesSections.forEach((section, index) => {
                const sectionImage = 'sectionImage_' + index;
                const matchingImageFile = req.files.find(file => file.fieldname === sectionImage);

                if (matchingImageFile) {
                  section.sectionImage = {
                    buffer: matchingImageFile.buffer,
                    contentType: matchingImageFile.mimetype
                  };
                }
              });
           }else {
              const imageFieldMapping = {
                'homeHeader':'homeHeaderImage',
                'homeAbout': 'homeAboutImage',
                'homeServices': 'homeServicesImage',
                'homeBrief': 'homeBriefImage',
                'aboutHeader':'AboutHeaderImage',
                'aboutGoals':'AboutGoalsImage',
                'aboutIntroduction':'AboutIntroductionImage',
                'showCasesIntroduction':'ShowCasesIntroductionImage',
                'showCasesHeader':'ShowCasesHeaderImage',
                'contactHeader':'contactHeaderImage',
                'ContactIntroduction':'ContactIntroductionImage'                
              };

              const imageFieldName = imageFieldMapping[contentData.title];
              if (imageFieldName) {
                const matchingImageFile = req.files.find(file => file.fieldname === imageFieldName);

                if (matchingImageFile) {
                  contentData.data[imageFieldName] = {
                    buffer: matchingImageFile.buffer,
                    contentType: matchingImageFile.mimetype
                  };
                } else {
                  console.warn(`No image uploaded for field: ${imageFieldName}`);
                }
              }
            }

            content.data = contentData.data;
            await content.save();
          
        }

        if (!section.Contents.includes(content._id)) {
          section.Contents.push(content._id);
        }
      }

      await section.save();
    }

    await page.save();
    res.json(page);
    res.status(2001).send('Data send successfully');
  } catch (err) {
    console.error(err.message);
    if (!res.headersSent) { 
      res.status(500).send('Server Error');
    }
  }
};


