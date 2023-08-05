const container = document.getElementById('root');
const ajax = new XMLHttpRequest();
const content = document.createElement('div');
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json';
const VIEW_COUNT = 10;
const TOTAL_PAGE = Object.keys(getData(NEWS_URL)).length / VIEW_COUNT;
const store = {
	currentPage : 1,
}

function getData(url) {
  ajax.open('GET', url, false);
  ajax.send();

  return JSON.parse(ajax.response);
}

function newsFeed() {
	const newsFeed = getData(NEWS_URL);
	const newsList = [];
	console.log(store.totalPage); 

	newsList.push('<ul>');

	for(let i = (store.currentPage - 1) * VIEW_COUNT; i < store.currentPage * VIEW_COUNT; i++) {

		newsList.push(`
			<li>
				<a href="#/show/${newsFeed[i].id}">
					${newsFeed[i].title} (${newsFeed[i].comments_count})
				</a>
			</li>
		`);

	}
	newsList.push('</ul>');
	newsList.push(`
		<div>
			<a href="#/page/${store.currentPage > 1 ? store.currentPage - 1 : 1}"> 이전페이지로 </a>
			<a href="#/page/${store.currentPage < TOTAL_PAGE ? store.currentPage + 1 : TOTAL_PAGE}"> 다음페이지로 </a>
		</div>
	`); // 라스트 페이지는 어떻게 알까
	container.innerHTML = newsList.join('');
}


function newsDetail() {
  const id = location.hash.substring(7);
  const newsContent = getData(CONTENT_URL.replace('@id', id))

  container.innerHTML = `
    <h1>${newsContent.title}</h1>

    <div>
      <a href="#/page/${store.currentPage}">목록으로</a>
    </div>
  `;
}

function router() {
	const routePath = location.hash;

	if (routePath === '') {
		newsFeed();
	} else if (routePath.indexOf("#/page/") >= 0) {
		store.currentPage = Number(routePath.substring(7));
		newsFeed();
	} else {
		newsDetail();
	}
}

window.addEventListener('hashchange', router );
router();