<?php 
    /* Il codice HTML, sia statico che dinamicamente generato, produce
        un warning e un errore. Entrambi dipendono dall'estrattore.
        Il primo perchè il "nuovo" tag html non include la lingua mentre nel
        secondo caso, un '&lt;', usato nella navigazione mobile, viene trasformato in '<'
        sebbene nel codice sia correttamente 'escaped'.

        Ad eccezione del viewport (tag meta), non ci sono pezzi di codice copiati dal web.
        Il codice relativo ad Ajax su vecchie versioni di IE è stato preso dalle slide.
    */
    session_start();

    $login_failed = FALSE;
    $register_failed = FALSE;

    if(isset($_POST['logout'])){
        unset($_SESSION['user']);
    }

    if(isset($_POST['username'])){
        //login
        $mysqli = new mysqli('localhost', 'root', '', 'bouncethemall');
        if($mysqli->connect_error){
            die('Errore di connessione: '.$mysqli->connect_error);
        }

        $login_failed = TRUE;
        $register_failed = FALSE;
        $username = $mysqli->real_escape_string($_POST['username']);
        $pwd = $mysqli->real_escape_string($_POST['password']);
        $hashed_pwd = hash('sha256', $pwd);
        $query = "SELECT password FROM account WHERE username='$username'";
        $result = $mysqli->query($query);
        $row = $result->fetch_assoc();
        if($row['password'] == $hashed_pwd){
            //logged in succesfully
            $login_failed = FALSE;
            $_SESSION['user'] = $_POST['username'];
        } else if(!isset($row['password'])){
            //register account
            $login_failed = FALSE;
            if($pwd == ''){
                $register_failed = TRUE;
            } else {
                $query = "INSERT INTO account VALUES('$username', '$hashed_pwd')";
                $result = $mysqli->query($query);
                //insert user_data
                $query = "INSERT INTO user_data VALUES('$username', 0, 0, 1, 1)";
                $result = $mysqli->query($query);
                $_SESSION['user'] = $_POST['username'];
            }
        }

        $mysqli->close();
    }

    if(isset($_SESSION['user'])){
            //retrieve user data
            $mysqli = new mysqli('localhost', 'root', '', 'bouncethemall');
            $username = $_SESSION['user'];
            $query = "SELECT * FROM user_data WHERE username='$username'";
            $result = $mysqli->query($query);
            $row = $result->fetch_assoc();
            $money = $row['money'];
            $highscore = $row['highscore'];
            $shootLvl = $row['shoot_lvl'];
            $moveLvl = $row['move_lvl'];
            $mysqli->close();
    }

    $show_auth = (!isset($_SESSION['user']) && ($login_failed || $register_failed));    
?>
<!DOCTYPE html>
<html lang='it'>
    <head>
        <meta charset="utf-8">
        <meta name="author" content="Mirko Laruina">
        <meta name="description" content="Online game">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>BounceThemAll!</title>
        <link rel="stylesheet" href="./css/style.css" type="text/css">
        <link rel="stylesheet" href="./css/game.css" type="text/css">
        <link rel="stylesheet" href="./css/mobile.css" type="text/css">
        <script src="./js/game.js"></script>
        <script src="./js/ball.js"></script>
        <script src="./js/bullet.js"></script>
        <script src="./js/cannon.js"></script>
        <script src="./js/collision-detector.js"></script>
        <script src="./js/ajax.js"></script>
        <script>
            <?php   if(!isset($_SESSION['user'])){
                        echo 'user = {
                                points: 0,
                                money: 0,
                                shootLvl: 1,
                                moveLvl: 1,
                                highscore: 0,
                                name: null,
                                logged: 0
                                }';
                    } else {
                        echo "user = {
                                points: 0,
                                money: $money,
                                shootLvl: $shootLvl,
                                moveLvl: $moveLvl,
                                highscore: $highscore,
                                name: '$username',
                                logged: 1
                                }";
                    }
            ?>
        </script>
    </head>
    <body onload="init()" onkeydown="keydownHandler(event)" onkeyup="keyupHandler(event)">
        <div id="game-wrapper">
                <nav>
                    <button id="left-arrow" class="mobile-nav" onclick="mobileMove('l')" onmouseup="mobileMove('s')">&lt;</button>
                    <button id="right-arrow" class="mobile-nav" onclick="mobileMove('r')" onmouseup="mobileMove('s')">&gt;</button>
                </nav>
            <img id="cannon" src="img/cannon.png" alt="Cannone">
            <div id="stats">
                <p><img src='./img/boom.png' alt="Punti"><span id='points-value'></span></p>
                <p><img src="./img/diamond.png" alt="Diamanti"><span id="money-value"></span></p>
            </div>
            <section id="intro" class=<?php if(!$show_auth) echo '"menu down"'; else echo '"menu"'; ?>>
                <div class='menu-text'>
                    <?php
                        if(!isset($_SESSION['user'])){
                            echo 
                                '<h1>Benvenuto su BounceThemAll!</h1>
                                <p>Se passi per la prima volta di qui, dai un\'occhiata al manuale per capire
                                come si gioca, altrimenti puoi passare direttamente all\'azione!
                                </p>';
                        } else {
                            echo
                                '<h1>Ciao '.$_SESSION['user'].'!</h1>
                                <p>Sono felice di rivederti qui su BounceThemAll!<br>
                                    Ormai le regole dovresti conoscerle, ma se vuoi rivederle un attimo puoi dare
                                un\'occhiata al manuale!<br>
                                    Altrimenti, che ne dici di iniziare?</p>
                                ';
                        }
                    ?>
                </div>
                <?php
                    if(!isset($_SESSION['user'])){
                        echo '<button onclick="showLogin(); this.blur()">Login</button>';
                    } else {
                        echo '<form method="post" action="index.php">
                                <input type="submit" name="logout" value="Logout">
                              </form>';
                    }
                ?>
                <button onclick="showDoc(); this.blur()">Manuale</button>
                <button onclick="showPowerup(); this.blur()">Potenzia</button>
                <button id="start" onclick="startGame(); this.blur()">Inizia!</button>
            </section>
            <section id="doc-page" class="menu">
                <div class="menu-text">
                    <h2>Manuale</h2>
                    <p>BounceThemAll! è un gioco single-player dove dovrai far scoppiare il maggior numero di palline
                    possibili, collezionando diamanti e cercando di battere il tuo record!<br>
                    Quando una pallina ti colpisce, per te &egrave; finita, quindi cerca di stare attento.<br>
                    Avrai a disposizione un cannone, che puoi muovere a destra e sinistra usando i tasti freccia
                    (o, in alternativa, 'a' e 'd').<br>
                    Ogni pallina ha numero di vite, che troverai scritto al centro, che indica i colpi necessari prima
                    che questa esploda. Progredendo nel gioco questo numero aumenter&agrave; rendendo sempre pi&ugrave;
                    ostico sconfiggere le palline. <br>
                    Non tutte queste fantastiche sferette saltellanti nascono uguali, ma possono avere tre dimensioni diverse.
                    La dimensione le rende pi&ugrave; difficili da battere, ma in compenso aumenta anche la tua probabilit&agrave; di colpirle.<br>
                    Ogni volta che ne fai esplodere una, ricevi un certo numero di diamanti, uguale alla dimensione della stessa.
                    Accumulando i diamanti potrai potenziare il tuo cannone aumentandone la velocit&agrave; di sparo e di movimento.
                    Il costo del potenziamento ti verr&agrave; indicato nella schermata "Potenzia" e sar&agrave; in grigio se non hai abbastanza
                    diamanti per effettuarlo, altrimenti sar&agrave; arancione e cliccandolo lo effettuerai.<br>
                    Affinch&eacute; il tuo record e i potenziamenti restino per la tua prossima sessione di gioco, puoi registrarti.
                    Farlo &egrave; semplicissimo, ti basta cliccare su "Login" e inserire nome utente e password desiderati. Null'altro.
                    Se non sei registrato ti verr&agrave; creato l'account automaticamente, altrimenti accederai ritrovando diamanti, potenziamenti e record
                    ottenuti da sessioni di gioco precedenti.<br>
                    Per quanto riguarda il gioco, durante la partita potrai mettere in pausa in qualunque momento, cliccando la barra spaziatrice
                    o 'p', oppure utilizzando il tasto nell'angolino in alto a destra.
                    Nell'angolo a sinistra, invece, troverai il tuo punteggio attuale insieme ai tuoi diamanti.</p>
                </div>
                <button onclick="showIntro(); this.blur()">Torna al menu</button>
            </section>
            <section id="lost-game" class="menu">
                <div class="menu-text">
                    <h2>Hai perso!</h2>
                    <p>Non fa nulla, l'importante &egrave; non arrendersi mai!<br>
                        Il tuo record attuale &egrave;: <span id='highscore'>0</span><br>
                        Vuoi riprovare?
                    </p>
                </div>
                <button onclick="showIntro(); this.blur()">Indietro</button>
                <button id="restart" onclick="startGame(); this.blur()">Riprova</button>
            </section>
            <section id="pause" class="menu">
                <div class="menu-text">
                    <h2>Pausa</h2>
                    <p>Puoi premere 'p' o spazio per riprendere</p>
                </div>
                <button onclick="backToMenu(); this.blur()">Torna al menu</button>
            </section>
            <button id="pause-btn" onclick="pause(); this.blur()"></button>
            <section id="power-up-msg" class="menu">
                <div class="menu-text">
                    <h2>Potenziamenti</h2>
                    <p>Qui puoi potenziare il tuo cannone</p>
                    <div>
                        <p>Velocit&agrave; di sparo:<br>
                            <span class="powerup" id="shoot-current-lvl">1</span>
                            <button id="shoot-power-cost" onclick="powerShoot()">
                                <img src="./img/diamond.png" alt="Diamanti">100
                            </button>
                        </p>
                    </div>
                    <div>
                        <p>Velocit&agrave; di movimento:<br>
                            <span class="powerup" id="move-current-lvl">1</span>
                            <button id="move-power-cost" onclick="powerMove()">
                                <img src="./img/diamond.png" alt="Diamanti">100
                            </button>
                        </p>
                    </div>
                </div>
                <button onclick="showIntro(); this.blur()">Indietro</button>
            </section>
            <?php 
                if($show_auth){
                    echo '<section id="login-msg" class="menu down">
                            <div class="menu-text">';
                            if($login_failed == TRUE)
                                echo '<p>Login fallito: password errata</p>';
                            else
                                echo '<p>La password non pu&ograve; essere vuota</p>';
                } else {
                    echo '<section id="login-msg" class="menu">
                            <div class="menu-text">
                                <h2>Accedi</h2>';
                }
                ?>
                    <form action="index.php" method="post">
                        <p> Username:<br>
                            <input type="text" name="username"><br>
                            Password:<br>
                            <input type="password" name="password"><br>
                            <input type="submit" name="submit" value="Accedi">
                        </p>
                    </form>
                    <button onclick="showIntro(); this.blur()">Indietro</button>
                    <p>Se non sei gi&agrave; registrato, inserisci username e password desiderati e verr&agrave; creato un account automaticamente</p>
                </div>
            </section>
        </div>
    </body>
</html>