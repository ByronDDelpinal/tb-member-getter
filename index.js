const rp = require('request-promise');
const otcsv = require('objects-to-csv');
const cheerio = require('cheerio');

const getPageHTML = async page => {
  const baseURL = 'https://torchbearersakron.com/homepage/members'
  const pageNumber = page || 1;
  const paginationQueryString = `?upage=${pageNumber}`;

  return await rp(baseURL + paginationQueryString)
}

const getMemberUrl = element => element.attribs.href;

const getMemberURLs = async () => {
  const currentPage = 1;
  const memberSelectorFromList = '#members-list .item-title a';
  const pageNumberSelector = '.pagination-links a.page-numbers:not(.next)';
  const memberUrls = [];

  let html = await getPageHTML();

  const pageNumberElementList = cheerio(pageNumberSelector, html);
  const lastPageNumber = pageNumberElementList[pageNumberElementList.length - 1].children[0].data;

  for (index = 0; index < lastPageNumber; index++) {
    html = await getPageHTML(index);

    const memberListElements = cheerio(memberSelectorFromList, html);

    if (memberListElements.length > 0) {
      memberListElements.map((index, element) => memberUrls.push(getMemberUrl(element)));
    }
  }

  return memberUrls;
};

const memberURLs = getMemberURLs();