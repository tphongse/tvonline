var labels = ['HTTP DOWN', 'P2P DOWN', 'P2P UP']
var traffic = [0, 0, 0];
let now = new Date(); //
var trafficTime = [now, now, now]; //
var pieChart;

function startP2P()
{
    if (p2pml.hlsjs.Engine.isSupported()) {
        var engine = new p2pml.hlsjs.Engine();

        var player = new Clappr.Player({
            parentId: "#player",
            source: "https://wowza.peer5.com/live/smil:bbb_abr.smil/playlist.m3u8",
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
            let now = new Date(); //
            switch(method)
            {
                case 'http':
                    traffic[0] = bytes/(1024).toFixed(2);  
                    trafficTime[0] = now; //
                    break;
                case 'p2p':
                    traffic[1] = bytes/(1024).toFixed(2);
                    trafficTime[1] = now; //
                    break;
            }
            updatePieChart(traffic)
        });
        
        engine.on(p2pml.core.Events.PieceBytesUploaded, function (method, bytes){
            console.log('### Upload ###');
            console.log('-> '+method+': '+bytes);
            let now = new Date(); //
            traffic[2] = bytes/(1024).toFixed(2);
            trafficTime[2] = now; //
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

function resetTrafficDataset()
{
    let now = new Date();
    for(let i=0; i<trafficTime.length; i++)
    {
        let m1 = now.getMinutes();
        let m2 = trafficTime[i].getMinutes();
        if(Math.abs(m1-m2)>1) traffic[i] = 0;
    }
}

startP2P();
initPieChart();
setInterval(resetTrafficDataset, 1000); //
