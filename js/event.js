var labels = ['HTTP DOWN', 'P2P DOWN', 'P2P UP']
var traffic = [0, 0, 0];
var pieChart;

function startP2P()
{
    if (p2pml.hlsjs.Engine.isSupported()) {
        var engine = new p2pml.hlsjs.Engine();

        var player = new Clappr.Player({
            parentId: "#player",
            source: "https://livecdn.fptplay.net/hda1/vtv1hd_hls.smil/playlist.m3u8?token=eyJjaGFubmVsX2lkIjogInZ0djEtaGQiLCAicm1pcCI6ICIxMjMuMjAuMTQ5LjE0MyIsICJ1c2VyX2lkIjogNTI3MTY2MiwgInRpbWVzdGFtcCI6IDE2MjYyNzE3OTh9&user_id=8026601",
            mute: true,
            autoPlay: true,
            playback: {
                hlsjsConfig: {
                    liveSyncDurationCount: 7,
                    loader: engine.createLoaderClass()
                }
            }
        });

        engine.on(p2pml.core.Events.PieceBytesDownloaded, function (method, bytes, peerId){
            console.log('### Download ###');
            console.log('-> '+method+': '+bytes);
            switch(method)
            {
                case 'http':
                    traffic[0] += bytes/(1024*1024).toFixed(2);
                    break;
                case 'p2p':
                    traffic[1] += bytes/(1024*1024).toFixed(2);
                    break;
            }
            updatePieChart(traffic)
        });
        
        engine.on(p2pml.core.Events.PieceBytesUploaded, function (method, bytes){
            console.log('### Upload ###');
            console.log('-> '+method+': '+bytes);
            traffic[2] += bytes/(1024*1024).toFixed(2);
            updatePieChart(traffic)
        });

        p2pml.hlsjs.initClapprPlayer(player); // Player allows to subcribe to events on hls.js player
        
        
    } else {
        document.write("Not supported :(");
    }
}

function initPieChart()
{
    let data = {
        labels: labels,
        datasets: [{
          label: 'TrafFic',
          data: traffic,
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
          ],
          hoverOffset: 4
        }]
    };

    let config = {
        type: 'pie',
        data: data,
        options: {
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: 'white',
                    }
                }
            }
        }
    };

    pieChart = new Chart(
        document.getElementById('pieChart'),
        config,
    );
}

function updatePieChart(traffic)
{
    pieChart.data.datasets.forEach((dataset) => {
        dataset.data = traffic;
    });
    pieChart.update();
}

startP2P();
initPieChart();