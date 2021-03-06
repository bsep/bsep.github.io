function select () { this.select(); }

var packsUrl = 'https://rawgit.com/bsep/packs/gh-pages/packs.json';
var versionUrl = 'https://api.github.com/repos/bsep/server/releases/latest';
var packList = $('#pack-list');

function insertPack (item) {
  var url = location.protocol + '//' + location.hostname + '/packs/' + item.url;
  $(`<li class="well"><h3>${item.name}</h3><p>${item.desc}</p><input class="form-control" type="text" readonly></li>`)
    .appendTo(packList)
    .children('input')
    .css('width', '' + (url.length * 9) + 'px')
    .val(url)
    .click(select);
}

function load (key, url, cb) {
  var val = lscache.get(key);
  if (val) {
    cb(val);
  } else {
    $.getJSON(url, function (data) {
      lscache.set(key, data, 15);
      load(key, url, cb);
    });
  }
}

load('packs', packsUrl, (data) => data.forEach(insertPack));

load('version', versionUrl, function (data) {
  var verList = $('#dl-list');
  $('#version-label').text(data.tag_name);

  data.assets.forEach(function (asset) {
    var releaseName = 'Download for ';

    if (asset.name.includes('linux')) releaseName += 'Linux';
    else if (asset.name.includes('mac')) releaseName += 'Mac';
    else if (asset.name.includes('windows')) releaseName += 'Windows';

    if (asset.name.includes('amd64')) releaseName += ' (64-bit)';
    if (asset.name.includes('checksums')) releaseName = 'Checksums';

    verList.append(`<li><a class="btn btn-lg btn-default btn-block" href="${asset.browser_download_url}">
      <span class="glyphicon glyphicon-download-alt"></span>
      ${releaseName}</a></li>`)
  })
});
