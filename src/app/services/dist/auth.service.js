"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.AuthService = void 0;
var core_1 = require("@angular/core");
var operators_1 = require("rxjs/operators");
var auth_1 = require("@angular/fire/auth");
var AuthService = /** @class */ (function () {
    function AuthService(afAuth, usuarioService, pacienteService, doctorService) {
        this.afAuth = afAuth;
        this.usuarioService = usuarioService;
        this.pacienteService = pacienteService;
        this.doctorService = doctorService;
        this.authState$ = auth_1.authState(this.afAuth); // Observador del usuario logueado
    }
    AuthService.prototype.getUsuarioEmail = function () {
        return this.authState$.pipe(operators_1.map(function (user) { return (user && user.email) || null; }));
    };
    AuthService.prototype.getCurrentUser = function () {
        return this.authState$.pipe(operators_1.map(function (user) { return user && user.email || null; }));
    };
    AuthService.prototype.register = function (password, rol, paciente, doctores) {
        return __awaiter(this, void 0, void 0, function () {
            var user, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(rol === 'PACIENTE' && paciente)) return [3 /*break*/, 3];
                        this.usuarioService.registerUsuario(paciente.correoElectronico, rol);
                        return [4 /*yield*/, auth_1.createUserWithEmailAndPassword(this.afAuth, paciente.correoElectronico, password)];
                    case 1:
                        user = _a.sent();
                        this.pacienteService.addPaciente(paciente);
                        return [4 /*yield*/, auth_1.signInWithEmailAndPassword(this.afAuth, paciente.correoElectronico, password)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        if (!(rol === 'MEDICO' && doctores)) return [3 /*break*/, 6];
                        this.usuarioService.registerUsuario(doctores.correoElectronico, rol);
                        return [4 /*yield*/, auth_1.createUserWithEmailAndPassword(this.afAuth, doctores.correoElectronico, password)];
                    case 4:
                        user = _a.sent();
                        this.doctorService.addDoctor(doctores);
                        return [4 /*yield*/, auth_1.signInWithEmailAndPassword(this.afAuth, doctores.correoElectronico, password)];
                    case 5: return [2 /*return*/, _a.sent()]; // Linea que inicia sesion
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    ;
    AuthService.prototype.login = function (email, password) {
        return __awaiter(this, void 0, void 0, function () {
            var rol;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.usuarioService.getUsuarioRol(email).then(function (snapshot) {
                            return snapshot;
                        })];
                    case 1:
                        rol = _a.sent();
                        if (rol !== null) {
                            localStorage.setItem('ROL', rol);
                        }
                        return [2 /*return*/, auth_1.signInWithEmailAndPassword(this.afAuth, email, password)];
                }
            });
        });
    };
    AuthService.prototype.logout = function () {
        return auth_1.signOut(this.afAuth);
    };
    AuthService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], AuthService);
    return AuthService;
}());
exports.AuthService = AuthService;
