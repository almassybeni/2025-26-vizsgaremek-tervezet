-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2026. Jan 16. 10:15
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `kulturvadasz`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `felhasznalo`
--

CREATE TABLE `felhasznalo` (
  `id` int(11) NOT NULL,
  `email` varchar(180) NOT NULL,
  `jelszo_hash` varchar(255) NOT NULL,
  `nev` varchar(100) NOT NULL,
  `telefon` varchar(30) DEFAULT NULL,
  `aktiv` tinyint(1) DEFAULT 1,
  `letrehozva` datetime DEFAULT current_timestamp(),
  `utoljara_be` datetime DEFAULT NULL,
  `utoljara_mod` datetime DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `felhasznalo_szerep`
--

CREATE TABLE `felhasznalo_szerep` (
  `felhasznalo_id` int(11) NOT NULL,
  `szerepkor_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `jelentkezes`
--

CREATE TABLE `jelentkezes` (
  `id` int(11) NOT NULL,
  `felhasznalo_id` int(11) NOT NULL,
  `irszam` char(4) NOT NULL,
  `turafajta_id` int(11) NOT NULL,
  `datum` date NOT NULL,
  `letszam` tinyint(3) UNSIGNED NOT NULL DEFAULT 1,
  `megjegyzes` text DEFAULT NULL,
  `letrehozva` datetime DEFAULT current_timestamp(),
  `modositva` datetime DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `szerepkor`
--

CREATE TABLE `szerepkor` (
  `id` int(11) NOT NULL,
  `Nev` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `szerepkor`
--

INSERT INTO `szerepkor` (`id`, `Nev`) VALUES
(1, ''),
(2, ''),
(3, '');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `tajegyseg`
--

CREATE TABLE `tajegyseg` (
  `id` int(11) NOT NULL,
  `nev` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `telepules`
--

CREATE TABLE `telepules` (
  `irszam` char(4) NOT NULL,
  `nev` varchar(100) NOT NULL,
  `tajegyseg_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `turafajta`
--

CREATE TABLE `turafajta` (
  `id` int(11) NOT NULL,
  `nev` varchar(80) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `turafajta`
--

INSERT INTO `turafajta` (`id`, `nev`) VALUES
(1, 'gyalogtúra'),
(2, 'kerékpártúra'),
(3, 'túrahajózás'),
(4, 'sétatúra'),
(5, 'nordic walking'),
(6, 'téli túra'),
(7, 'családi program'),
(8, 'tematikus túra'),
(9, 'madármegfigyelés'),
(10, 'geocaching');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `felhasznalo`
--
ALTER TABLE `felhasznalo`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `felhasznalo_szerep`
--
ALTER TABLE `felhasznalo_szerep`
  ADD PRIMARY KEY (`felhasznalo_id`,`szerepkor_id`),
  ADD KEY `szerepkor_id` (`szerepkor_id`);

--
-- A tábla indexei `jelentkezes`
--
ALTER TABLE `jelentkezes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_felhasznalo` (`felhasznalo_id`),
  ADD KEY `idx_datum` (`datum`),
  ADD KEY `idx_irszam` (`irszam`),
  ADD KEY `turafajta_id` (`turafajta_id`);

--
-- A tábla indexei `szerepkor`
--
ALTER TABLE `szerepkor`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `tajegyseg`
--
ALTER TABLE `tajegyseg`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `telepules`
--
ALTER TABLE `telepules`
  ADD PRIMARY KEY (`irszam`),
  ADD KEY `tajegyseg_id` (`tajegyseg_id`);

--
-- A tábla indexei `turafajta`
--
ALTER TABLE `turafajta`
  ADD PRIMARY KEY (`id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `felhasznalo`
--
ALTER TABLE `felhasznalo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `jelentkezes`
--
ALTER TABLE `jelentkezes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `szerepkor`
--
ALTER TABLE `szerepkor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `tajegyseg`
--
ALTER TABLE `tajegyseg`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `turafajta`
--
ALTER TABLE `turafajta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `felhasznalo_szerep`
--
ALTER TABLE `felhasznalo_szerep`
  ADD CONSTRAINT `felhasznalo_szerep_ibfk_1` FOREIGN KEY (`felhasznalo_id`) REFERENCES `felhasznalo` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `felhasznalo_szerep_ibfk_2` FOREIGN KEY (`szerepkor_id`) REFERENCES `szerepkor` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `jelentkezes`
--
ALTER TABLE `jelentkezes`
  ADD CONSTRAINT `jelentkezes_ibfk_1` FOREIGN KEY (`felhasznalo_id`) REFERENCES `felhasznalo` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `jelentkezes_ibfk_2` FOREIGN KEY (`irszam`) REFERENCES `telepules` (`irszam`) ON UPDATE CASCADE,
  ADD CONSTRAINT `jelentkezes_ibfk_3` FOREIGN KEY (`turafajta_id`) REFERENCES `turafajta` (`id`) ON UPDATE CASCADE;

--
-- Megkötések a táblához `telepules`
--
ALTER TABLE `telepules`
  ADD CONSTRAINT `telepules_ibfk_1` FOREIGN KEY (`tajegyseg_id`) REFERENCES `tajegyseg` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
