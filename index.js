const rp = require("request-promise");
const otcsv = require("objects-to-csv");
const cheerio = require("cheerio");

const getIndexPageHTML = async (page) => {
  const baseURL = "https://torchbearersakron.com/homepage/members";
  const pageNumber = page || 1;
  const paginationQueryString = `?upage=${pageNumber}`;

  return await rp(baseURL + paginationQueryString);
};

const getMember = async (memberURL) => {
  const member = {};
  const memberPageHTML = await getMemberPageHTML(memberURL);

  member.name = cheerio(".profile-fields .field_name:first-child .data p", memberPageHTML).text();
  console.log(member.name);

  return member;
};

const getMemberPageHTML = async (memberPageURL) => await rp(memberPageURL);

const getMemberURL = (element) => element.attribs.href;

const getMemberURLs = async () => {
  const currentPage = 1;
  const memberSelectorFromList = "#members-list .item-title a";
  const pageNumberSelector = ".pagination-links a.page-numbers:not(.next)";
  const memberURLs = [];

  let indexPageHTML = await getIndexPageHTML();

  const pageNumberElementList = cheerio(pageNumberSelector, indexPageHTML);
  const lastPageNumber = 1; //pageNumberElementList[pageNumberElementList.length - 1]?.children[0]?.data;

  for (index = 0; index < lastPageNumber; index++) {
    indexPageHTML = await getIndexPageHTML(index);

    const memberListElements = cheerio(memberSelectorFromList, indexPageHTML);

    if (memberListElements.length > 0) {
      memberListElements.map((index, element) =>
        memberURLs.push(getMemberURL(element))
      );
    }
  }

  return memberURLs;
};

const main = async () => {
  const members = [];
  const memberURLs = await getMemberURLs();

  await memberURLs.map(async (memberURL) => members.push(await getMember(memberURL)));

  console.log(members);
};

main();
